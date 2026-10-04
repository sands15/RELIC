const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../assets/paper-review-model.js');
const G=require('../assets/paper-review-github.js');
const sha='a'.repeat(40),commit='b'.repeat(40);
function fixture(){
  let user='sands15',putStatus=201,failAfterPut=false,malformed=false,limited=false,live=false,run='queued';
  const files=new Map(),calls=[];
  const fetch=async(url,options={})=>{
    const u=new URL(url),p=u.pathname,method=options.method||'GET';calls.push({url,options});
    const response=(s,data)=>({status:s,ok:s>=200&&s<300,headers:{get:name=>limited&&name==='x-ratelimit-remaining'?'0':null},text:async()=>JSON.stringify(data)});
    if(p==='/user')return response(200,{login:user,id:7});
    if(p==='/repos/sands15/RELIC')return response(200,{full_name:'sands15/RELIC',owner:{id:7}});
    if(p.endsWith('/runs'))return response(200,{workflow_runs:[{head_sha:commit,status:run==='success'?'completed':run,conclusion:run==='success'?'success':null}]});
    if(u.host==='sands15.github.io'){
      const data=files.get(p.replace('/RELIC/',''))?.value;
      if(p.endsWith('/index.json'))return response(200,live?[{...files.get('papers/example-review.json').value}]:[]);
      return response(live&&data?200:404,data||{});
    }
    const file=p.replace('/repos/sands15/RELIC/contents/','');
    if(method==='PUT'){
      if(putStatus!==201)return response(putStatus,{message:'Do not expose provider detail'});
      const b=JSON.parse(options.body);files.set(file,{value:JSON.parse(Buffer.from(b.content,'base64').toString('utf8')),sha});
      if(failAfterPut){failAfterPut=false;throw new DOMException('synthetic abort after write','AbortError');}
      if(malformed){malformed=false;return {...response(201,{}),text:async()=>'{broken'};}
      return response(201,{content:{path:file,sha},commit:{sha:commit}});
    }
    const stored=files.get(file);return stored?response(200,{type:'file',path:file,sha:stored.sha,encoding:'base64',content:Buffer.from(JSON.stringify(stored.value),'utf8').toString('base64')}):response(404,{});
  };
  return {client:G.createClient(fetch),calls,files,set user(v){user=v;},set putStatus(v){putStatus=v;},set uncertain(v){failAfterPut=v;},set malformed(v){malformed=v;},set limited(v){limited=v;},set live(v){live=v;},set run(v){run=v;}};
}
const review=()=>M.preparePublicReview({...M.newDraft(),id:'example-review',title:'한글 제목',paperTitle:'논문',paperUrl:'https://example.org',body:'한글 본문',privateNote:'NEVER EXPORT'},'2026-10-04T00:00:00.000Z');
test('owner authentication is required, other GitHub accounts cannot write',async()=>{
  const f=fixture();await assert.rejects(f.client.saveReview(review()),e=>e.code==='auth');
  f.user='someone-else';await assert.rejects(f.client.connect('synthetic-test-token'),e=>e.code==='owner');
  assert.equal(f.client.connected,false);assert.equal(f.calls.some(c=>c.options.method==='PUT'),false);
});
test('fixed Contents path saves Unicode public fields and verifies the exact committed content',async()=>{
  const f=fixture();await f.client.connect('synthetic-test-token');const r=review();r.privateNote='NOT PUBLIC';
  const saved=await f.client.saveReview(r);
  assert.equal(saved.commitSha,commit);assert.equal(saved.review.title,'한글 제목');assert.equal(saved.review.privateNote,undefined);
  const put=f.calls.find(c=>c.options.method==='PUT'),body=JSON.parse(put.options.body);
  assert.equal(put.url,'https://api.github.com/repos/sands15/RELIC/contents/papers/example-review.json');assert.equal(body.branch,'main');
  assert.equal(JSON.parse(Buffer.from(body.content,'base64').toString('utf8')).privateNote,undefined);
  assert.ok(f.calls.some(c=>c.url.includes('ref='+commit)));
  f.client.disconnect();assert.equal(f.client.connected,false);await assert.rejects(f.client.saveReview(r),e=>e.code==='auth');
});
test('stale or SHA-less edits never overwrite an existing GitHub file or change its first publication date',async()=>{
  const f=fixture(),r=review();f.files.set('papers/'+r.id+'.json',{value:r,sha});await f.client.connect('synthetic');
  await assert.rejects(f.client.saveReview({...r,title:'new'}),e=>e.code==='conflict');
  await assert.rejects(f.client.saveReview({...r,title:'new'},{expectedSha:'c'.repeat(40)}),e=>e.code==='conflict');
  await assert.rejects(f.client.saveReview({...r,publishedAt:'2026-10-03T00:00:00.000Z'},{expectedSha:sha}),e=>e.code==='conflict');
  assert.equal(f.calls.some(c=>c.options.method==='PUT'),false);
  await f.client.saveReview({...r,title:'new'},{expectedSha:sha});assert.equal(f.files.get('papers/'+r.id+'.json').value.publishedAt,r.publishedAt);
});
test('uncertain write can be recovered by identical content without another PUT',async()=>{
  const f=fixture(),r=review();await f.client.connect('synthetic');f.uncertain=true;
  await assert.rejects(f.client.saveReview(r),e=>e.code==='unknown');
  const saved=await f.client.saveReview(r);assert.equal(saved.alreadySaved,true);assert.equal(f.calls.filter(c=>c.options.method==='PUT').length,1);
});
test('category list starts empty and only owner-added unique names are stored',async()=>{
  const f=fixture();await f.client.connect('synthetic');assert.deepEqual((await f.client.readCategories()).categories,[]);
  assert.deepEqual((await f.client.addCategory('  내 연구  ')).categories,['내 연구']);
  await f.client.addCategory('내 연구');assert.equal(f.calls.filter(c=>c.options.method==='PUT').length,1);
  await assert.rejects(f.client.addCategory(' '),e=>e.code==='category');
  f.putStatus=409;await assert.rejects(f.client.addCategory('두 번째'),e=>e.code==='conflict');
  assert.deepEqual(f.files.get('paper-review-categories.json').value,['내 연구']);
});
test('repository save and actual deployment are separate; public reads never receive the token',async()=>{
  const f=fixture();await f.client.connect('synthetic-secret');const saved=await f.client.saveReview(review());
  assert.equal((await f.client.checkDeployment(saved)).state,'pending');f.run='success';
  assert.equal((await f.client.checkDeployment(saved)).state,'pending');f.live=true;
  assert.equal((await f.client.checkDeployment(saved)).state,'deployed');
  for(const call of f.calls.filter(c=>c.url.includes('/runs?')||c.url.includes('sands15.github.io')))assert.equal(call.options.headers?.Authorization,undefined);
});
test('permission errors are sanitized and invalid paths cannot issue a request',async()=>{
  const f=fixture();await f.client.connect('synthetic');f.putStatus=403;
  await assert.rejects(f.client.saveReview(review()),e=>e.code==='permission'&&!e.message.includes('provider detail'));
  const count=f.calls.length;await assert.rejects(f.client.readReview('../index'));assert.equal(f.calls.length,count);
});
test('a damaged successful PUT response is uncertain and recovers by a content read',async()=>{
  const f=fixture(),r=review();await f.client.connect('synthetic');f.malformed=true;
  await assert.rejects(f.client.saveReview(r),e=>e.code==='unknown');
  assert.equal((await f.client.saveReview(r)).alreadySaved,true);assert.equal(f.calls.filter(c=>c.options.method==='PUT').length,1);
});
test('403 with rate limit headers is a rate limit, not a missing write permission',async()=>{
  const f=fixture();await f.client.connect('synthetic');f.putStatus=403;f.limited=true;
  await assert.rejects(f.client.saveReview(review()),e=>e.code==='rate');
});
