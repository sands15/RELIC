const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../assets/paper-review-model.js');
const load=()=>require('../assets/paper-review-session.js');
test('reload restores owner session without browser credentials and write uses memory CSRF',async()=>{
  const calls=[],fetcher=async(path,options)=>{calls.push({path,options});return Response.json(path==='/auth/session'?{login:'sands15',csrf:'synthetic-csrf',expiresAt:Date.now()+10000}:{review:{id:'review-one'},sha:'a'.repeat(40)});};
  const client=load().createClient(fetcher,{location:{origin:'https://writer.example',pathname:'/paper-review-write.html',search:''}});
  assert.equal(await client.restore(),true);await client.saveReview({id:'review-one'},{expectedSha:null});
  assert.equal(calls[1].path,'/api/reviews/review-one');assert.equal(calls[1].options.headers['X-Relic-CSRF'],'synthetic-csrf');assert.equal(calls[1].options.headers.Authorization,undefined);
  assert.equal(calls[1].options.credentials,'same-origin');assert.equal(client.connected,true);
});
test('expiration locks client, failed logout preserves session and failed writes do not change caller input',async()=>{
  let failedLogout=true,expired=false;
  const client=load().createClient(async path=>{if(path==='/auth/session')return Response.json({login:'sands15',csrf:'synthetic-csrf',expiresAt:Date.now()+10000});if(path==='/auth/logout')return expired?Response.json({code:'auth'},{status:401}):failedLogout?Response.json({code:'network'},{status:502}):Response.json({loggedOut:true});return Response.json({code:expired?'auth':'conflict'},{status:expired?401:409});});
  await client.restore();await assert.rejects(client.disconnect(),e=>e.code==='network');assert.equal(client.connected,true);
  const review={id:'review-one',title:'kept input'};await assert.rejects(client.saveReview(review),e=>e.code==='conflict');assert.equal(review.title,'kept input');
  expired=true;await assert.rejects(client.saveReview(review),e=>e.code==='auth');assert.equal(client.connected,false);assert.equal(review.title,'kept input');
});
test('draft transfer validates envelopes, imports missing drafts only, and preserves conflicting existing drafts',async()=>{
  const S=load(),r={...M.newDraft(),id:'original-draft',title:'unfinished draft',paperUrl:'https://'},values=new Map();
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),key:i=>[...values.keys()][i],get length(){return values.size;}};
  const locks={request:async(name,fn)=>fn()},envelope={version:1,review:r,savedAt:'original-stamp'};
  const result=await S.importDrafts(storage,[envelope],locks);assert.equal(result.imported,1);assert.equal(M.loadDraft(storage,r.id).review.paperUrl,'https://');
  const existing=storage.getItem(M.PREFIX+r.id);const conflict=await S.importDrafts(storage,[{...envelope,review:{...r,title:'overwrite attempt'}}],locks);
  assert.equal(conflict.skipped,1);assert.equal(storage.getItem(M.PREFIX+r.id),existing);
  const invalid=await S.importDrafts(storage,[{...envelope,review:{...r,id:'../outside'}}],locks);assert.equal(invalid.skipped,1);assert.equal(values.size,1);
});
test('unconfigured static site does not redirect to an arbitrary origin or reveal drafts',async()=>{
  const client=load().createClient(async path=>path==='/auth/session'?new Response('not found',{status:404}):Response.json({writerOrigin:'javascript:alert(1)'}),{location:{origin:'https://sands15.github.io',pathname:'/RELIC/paper-review-write.html',search:''}});
  assert.equal(await client.restore(),false);await assert.rejects(client.connect(),e=>e.code==='configured');
});
test('rotated session CSRF reveals authentication recovery and oversized successful write stays uncertain',async()=>{
  let rotated=false,oversized=false;
  const client=load().createClient(async path=>path==='/auth/session'?Response.json({login:'sands15',csrf:rotated?'new-csrf':'old-csrf',expiresAt:Date.now()+10000}):oversized?new Response('x'.repeat(3_000_001)):Response.json({code:'csrf'},{status:403}));
  await client.restore();rotated=true;await assert.rejects(client.saveReview({id:'review-one'}),e=>e.code==='csrf');assert.equal(client.connected,false);
  assert.equal(await client.restore(),true);oversized=true;await assert.rejects(client.saveReview({id:'review-one'}),e=>e.code==='unknown');
});
test('keepCurrent login opens OAuth separately without navigating away from the unsaved editor',async()=>{
  const opens=[],moves=[];
  const client=load().createClient(async()=>Response.json({ready:true}),{location:{pathname:'/paper-review-write.html',search:'?draft=review-one',assign:url=>moves.push(url)},open:(url,target)=>{opens.push({url,target});return {};}});
  await client.login({keepCurrent:true});assert.equal(moves.length,0);assert.equal(opens.length,1);assert.equal(opens[0].target,'_blank');
  assert.equal(new URL(opens[0].url,'https://writer.example').pathname,'/auth/login');
});
