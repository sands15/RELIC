const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../assets/paper-review-model.js');
const origin='https://relic-writer.example',env={PUBLIC_ORIGIN:origin,GH_CLIENT_ID:'Iv1.synthetic',GH_CLIENT_SECRET:'synthetic-secret-for-offline-only',SESSION_KEY:'a'.repeat(64)};
const load=()=>import('../auth/paper-reviews/worker.mjs');
function provider({other=false}={}){
  const files=new Map(),calls=[];let exchange;
  const fetcher=async(url,options={})=>{
    calls.push({url,method:options.method||'GET',userAgent:options.headers?.['User-Agent']});
    if(url==='https://github.com/login/oauth/access_token'){exchange=JSON.parse(options.body);return Response.json({access_token:other?'synthetic-other':'synthetic-owner',token_type:'bearer',expires_in:28800});}
    if(url==='https://api.github.com/user')return Response.json({login:other?'someone-else':'sands15',id:other?2:1});
    if(url==='https://api.github.com/repos/sands15/RELIC')return Response.json({full_name:'sands15/RELIC',owner:{id:1}});
    const u=new URL(url),path=u.pathname.split('/contents/')[1];
    if(path){
      if(options.method==='PUT'){const b=JSON.parse(options.body),value=JSON.parse(Buffer.from(b.content,'base64'));files.set(path,value);return Response.json({content:{path,sha:'b'.repeat(40)},commit:{sha:'c'.repeat(40)}},{status:201});}
      if(!files.has(path))return new Response('',{status:404});
      return Response.json({type:'file',path,sha:'b'.repeat(40),encoding:'base64',content:Buffer.from(JSON.stringify(files.get(path))).toString('base64')});
    }
    throw Error('unexpected provider route');
  };
  return {fetcher,files,calls,get exchange(){return exchange;}};
}
function cookies(response){return response.headers.getSetCookie().map(v=>v.split(';')[0]);}
async function signIn(handler){
  const start=await handler(new Request(origin+'/auth/login?returnTo='+encodeURIComponent('/paper-review-write.html?draft=synthetic-draft')),env);
  const target=new URL(start.headers.get('location')),flow=cookies(start).find(v=>v.startsWith('__Host-relic_oauth=')&&!v.endsWith('='));
  const done=await handler(new Request(origin+'/auth/callback?code=synthetic-code&state='+target.searchParams.get('state'),{headers:{cookie:flow}}),env);
  return {start,target,flow,done,cookie:cookies(done).find(v=>v.startsWith('__Host-relic_session=')&&!v.endsWith('='))};
}
test('OAuth uses PKCE/state, checks owner, and restores an opaque HttpOnly session after reload',async()=>{
  const {createHandler}=await load(),p=provider(),handler=createHandler({fetcher:p.fetcher});
  const s=await signIn(handler);assert.equal(s.start.status,302);assert.equal(s.target.hostname,'github.com');
  assert.equal(s.target.searchParams.get('code_challenge_method'),'S256');assert.ok(s.target.searchParams.get('code_challenge'));
  assert.equal(s.done.status,303);assert.equal(s.done.headers.get('location'),'/paper-review-write.html?draft=synthetic-draft');
  assert.ok(p.exchange.code_verifier);assert.equal(p.exchange.client_secret,env.GH_CLIENT_SECRET);
  assert.ok(p.calls.filter(c=>c.url.startsWith('https://api.github.com/')).every(c=>c.userAgent==='RELIC-Paper-Reviews'));
  const sessionHeader=s.done.headers.getSetCookie().find(v=>v.startsWith('__Host-relic_session='));
  assert.match(sessionHeader,/HttpOnly/);assert.match(sessionHeader,/Secure/);assert.match(sessionHeader,/SameSite=Lax/);assert.ok(!sessionHeader.includes('synthetic-owner'));
  const status=await handler(new Request(origin+'/auth/session',{headers:{cookie:s.cookie}}),env),value=await status.json();
  assert.equal(status.status,200);assert.equal(value.login,'sands15');assert.ok(value.csrf);assert.ok(!JSON.stringify(value).includes('synthetic-owner'));
  assert.equal((await handler(new Request(origin+'/auth/session',{headers:{cookie:s.cookie}}),env)).status,200);
});
test('missing/altered state, another account, altered cookie and expired session cannot authorize writes',async()=>{
  const {createHandler}=await load(),p=provider();let time=Date.now();const handler=createHandler({fetcher:p.fetcher,now:()=>time});
  const s=await signIn(handler);
  assert.equal((await handler(new Request(origin+'/auth/callback?code=synthetic-code&state=wrong',{headers:{cookie:s.flow}}),env)).status,303);
  assert.equal(p.calls.filter(c=>c.url.endsWith('/access_token')).length,1);
  assert.equal((await handler(new Request(origin+'/auth/session',{headers:{cookie:s.cookie+'x'}}),env)).status,401);
  time+=8*60*60*1000+1;assert.equal((await handler(new Request(origin+'/auth/session',{headers:{cookie:s.cookie}}),env)).status,401);
  const other=provider({other:true}),denied=await signIn(createHandler({fetcher:other.fetcher}));assert.equal(denied.cookie,undefined);assert.match(denied.done.headers.get('location'),/auth=owner/);
});
test('server enforces session/CSRF, fixed paths, validated public data and SHA conflicts',async()=>{
  const {createHandler}=await load(),p=provider(),handler=createHandler({fetcher:p.fetcher}),s=await signIn(handler);
  const st=await (await handler(new Request(origin+'/auth/session',{headers:{cookie:s.cookie}}),env)).json();
  const review=M.preparePublicReview({...M.newDraft(),title:'테스트',paperTitle:'논문',paperUrl:'https://example.org/paper',body:'본문'});
  const req=(path,body,headers={})=>new Request(origin+path,{method:'PUT',headers:{cookie:s.cookie,origin,'content-type':'application/json','x-relic-csrf':st.csrf,...headers},body:JSON.stringify(body)});
  assert.equal((await handler(req('/api/reviews/'+review.id,{review},{origin:'https://attacker.example'}),env)).status,403);
  assert.equal((await handler(req('/api/reviews/'+review.id,{review},{'x-relic-csrf':'bad'}),env)).status,403);
  assert.equal((await handler(req('/api/reviews/index',{review}),env)).status,422);
  assert.equal((await handler(req('/api/reviews/'+review.id,{review:{...review,paperUrl:'javascript:alert(1)'}}),env)).status,422);
  const result=await handler(req('/api/reviews/'+review.id,{review:{...review,privateMemo:'do-not-publish'},expectedSha:null}),env);
  assert.equal(result.status,200);assert.equal(p.files.get('papers/'+review.id+'.json').privateMemo,undefined);
  assert.equal((await handler(req('/api/reviews/'+review.id,{review:{...review,title:'changed'},expectedSha:null}),env)).status,409);
  assert.ok(p.calls.filter(c=>c.method==='PUT').every(c=>c.url.includes('/contents/papers/')));
  assert.equal((await handler(new Request(origin+'/api/reviews/'+review.id),env)).status,401);
  const logout=await handler(new Request(origin+'/auth/logout',{method:'POST',headers:{cookie:s.cookie,origin,'x-relic-csrf':st.csrf}}),env);assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
});
test('unconfigured or mismatched origins fail closed without provider requests',async()=>{
  const {createHandler}=await load(),p=provider(),handler=createHandler({fetcher:p.fetcher});
  assert.equal((await handler(new Request(origin+'/auth/login'),{})).status,503);
  assert.equal((await handler(new Request('https://wrong.example/auth/login'),env)).status,503);assert.equal(p.calls.length,0);
});

test('OAuth failure reports only a fixed reason without leaking provider details',async()=>{
  const {createHandler}=await load(),p=provider();
  for(const status of [200,400,401]){
    const handler=createHandler({fetcher:async(url,options)=>url==='https://github.com/login/oauth/access_token'?Response.json({error:'incorrect_client_credentials',error_description:'synthetic-private-detail'},{status}):p.fetcher(url,options)});
    const s=await signIn(handler);
    assert.equal(s.done.headers.get('location'),'/paper-review-write.html?auth=denied&reason=credentials');
    assert.ok(!s.done.headers.get('location').includes('synthetic-private-detail'));
    assert.ok(s.done.headers.getSetCookie().every(value=>/Max-Age=0/.test(value)));
  }
});

test('Workers GitHub transport never follows redirects for OAuth or repository requests',async()=>{
  const {createHandler}=await load(),p=provider();
  const handler=createHandler({fetcher:async(url,options)=>{
    assert.equal(options.redirect,'manual');assert.equal(options.headers['User-Agent'],'RELIC-Paper-Reviews');
    return p.fetcher(url,options);
  }});
  const s=await signIn(handler);assert.ok(s.cookie,'unsupported redirect mode must not block owner login');
  assert.equal((await handler(new Request(origin+'/auth/session',{headers:{cookie:s.cookie}}),env)).status,200);
  let calls=0;
  const redirectHandler=createHandler({fetcher:async(url,options)=>{calls++;assert.equal(url,'https://github.com/login/oauth/access_token');assert.equal(options.redirect,'manual');return new Response('',{status:302,headers:{Location:'https://example.org/credential-trap'}});}});
  const denied=await signIn(redirectHandler);assert.equal(denied.cookie,undefined);assert.equal(calls,1);
  assert.ok(denied.done.headers.getSetCookie().every(value=>/Max-Age=0/.test(value)));
});
test('asset settings preserve html writer URLs and draft queries without clean-url redirects',async()=>{
  const {createHandler}=await load(),config=JSON.parse(require('node:fs').readFileSync(require('node:path').join(__dirname,'../auth/paper-reviews/wrangler.jsonc'),'utf8'));
  const assets={fetch:async request=>config.assets.html_handling==='none'?new Response('<html>writer</html>'):Response.redirect(origin+'/paper-review-write',307)};
  const result=await createHandler()(new Request(origin+'/paper-review-write.html?draft=synthetic-draft'),{...env,ASSETS:assets});
  assert.equal(result.status,200);
});
