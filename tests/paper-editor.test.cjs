const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const M=require('../assets/paper-review-model.js');
async function harness(locks={request:async(name,fn)=>fn()},options={}){
  const published={...M.newDraft(),id:'same-review',title:'Synthetic review',paperTitle:'Synthetic paper',paperUrl:'https://example.org/paper',body:'Synthetic body',publishedAt:'2026-01-01T00:00:00.000Z',updatedAt:'2026-01-01T00:00:00.000Z'};
  const values=new Map([[M.PREFIX+published.id,JSON.stringify({version:1,review:{...published,publishedAt:'',updatedAt:''},savedAt:'old'})]]);
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),key:i=>[...values.keys()][i],get length(){return values.size}};
  const elements=new Map();
  function get(id){if(!elements.has(id))elements.set(id,{value:'',textContent:'',hidden:false,handlers:{},classList:{toggle(){}},setAttribute(){},removeAttribute(){},addEventListener(name,fn){this.handlers[name]=fn},querySelectorAll(){return []},scrollIntoView(){},focus(){},append(){}});return elements.get(id);}
  const form=get('review-form');form.elements={};for(const f of [...M.TEXT_FIELDS,'tags'])form.elements[f]=get(f);
  const document={getElementById:get,querySelector:get,createElement:()=>({value:'',textContent:''})};
  let prepared,currentUrl='';
  let connected=false;
  const github={connect:async()=>{if(options.otherOwner)throw Object.assign(Error(),{code:'owner'});connected=true;},disconnect:()=>{connected=false;},get connected(){return connected;},readReview:async()=>({review:published,sha:'a'.repeat(40)}),readCategories:async()=>({categories:[]}),addCategory:async name=>({categories:[name]}),saveReview:options.saveReview|| (async review=>({review,sha:'b'.repeat(40),commitSha:'c'.repeat(40)})),checkDeployment:async()=>({state:'pending'})};
  const ctx={document,PaperReview:{...M,preparePublicReview(d){prepared=M.preparePublicReview(d,'2026-10-04T00:00:00.000Z');return prepared;}},PaperReviewUI:{readReview:async()=>published,article:()=>''},PaperReviewGitHub:{createClient:()=>github},localStorage:storage,navigator:{locks},location:{search:'?edit=same-review',pathname:'/paper-review-write.html'},history:{replaceState(a,b,url){currentUrl=url;}},URLSearchParams,setTimeout,clearTimeout,confirm:()=>true,addEventListener(){}};ctx.window=ctx;
  if(options.session){github.restore=async()=>{connected=await options.restore();return connected;};github.login=options.login|| (async()=>false);ctx.PaperReviewSession={createClient:()=>github,receiveDrafts:async()=>null};}
  await vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/paper-review-editor.js'),'utf8'),ctx);
  if(options.autoConnect!==false){get('github-token').value='SYNTHETIC-IN-MEMORY';await get('connect-github').handlers.click();}
  return {get,form,storage,published,github,get prepared(){return prepared;},get url(){return currentUrl;}};
}
test('editing a published review preserves its original publication date over a local draft',async()=>{
  const h=await harness(),{get,published}=h;
  await get('prepare-publish').handlers.click();
  assert.equal(h.prepared.id,published.id);assert.equal(h.prepared.publishedAt,published.publishedAt);
});
test('authentication hides authoring and drafts from visitors and other accounts',async()=>{
  const h=await harness(undefined,{autoConnect:false,otherOwner:true});
  assert.equal(h.get('.editor-layout').hidden,true);assert.equal(h.get('draft-select').innerHTML,undefined);
  h.get('github-token').value='SYNTHETIC-OTHER';await h.get('connect-github').handlers.click();
  assert.equal(h.get('.editor-layout').hidden,true);assert.equal(h.get('github-token').value,'');
  assert.match(h.get('auth-status').textContent,/소유자/);
});
test('owner token is cleared, never becomes draft data, and disconnect locks the editor',async()=>{
  const h=await harness();assert.equal(h.get('.editor-layout').hidden,false);assert.equal(h.get('github-token').value,'');
  await h.get('save-draft').handlers.click();assert.equal(JSON.stringify(M.loadDraft(h.storage,h.published.id)).includes('SYNTHETIC-IN-MEMORY'),false);
  await h.get('disconnect-github').handlers.click();assert.equal(h.get('.editor-layout').hidden,true);
});
test('GitHub save keeps newer typed input and rejects draft transitions until remote save finishes',async()=>{
  let release,entered;const pending=new Promise(resolve=>entered=resolve);let sent;
  const h=await harness(undefined,{saveReview:async review=>{sent=review;entered();await new Promise(resolve=>release=resolve);return {review,sha:'b'.repeat(40),commitSha:'c'.repeat(40)};}});
  h.get('title').value='submitted title';h.form.handlers.input();const saving=h.get('save-github').handlers.click();await pending;
  h.get('title').value='newer title';h.form.handlers.input();await h.get('new-draft').handlers.click();release();await saving;
  assert.equal(sent.title,'submitted title');assert.equal(h.get('title').value,'newer title');
  assert.equal(M.loadDraft(h.storage,h.published.id).review.title,'newer title');
  assert.match(h.get('github-save-status').textContent,/추가 입력/);
});
test('draft transition saves input typed while the browser lock is pending',async()=>{
  let release,entered;const pending=new Promise(resolve=>entered=resolve);
  let blocked=true;
  const locks={request:async(name,fn)=>{if(blocked){blocked=false;entered();await new Promise(resolve=>release=resolve);}return fn();}};
  const h=await harness(locks),{get,form,storage,published}=h;
  get('title').value='first input';form.handlers.input();
  const switching=get('new-draft').handlers.click();await pending;
  get('title').value='input typed while save waits';form.handlers.input();release();
  await switching;
  assert.equal(M.loadDraft(storage,published.id).review.title,'input typed while save waits');
  assert.equal(get('title').value,'');
});
test('editor imports an incomplete backup without losing its original input',async()=>{
  const h=await harness(),{get,published}=h;
  const draft={...published,id:'incomplete-backup',paperUrl:'https://',year:'20',tags:Array.from({length:21},(_,i)=>'태그'+i)};
  const file={size:2000,text:async()=>JSON.stringify({version:1,kind:'relic-paper-draft',review:draft})};
  await get('import-draft').handlers.change({target:{files:[file],value:'selected'}});
  assert.equal(get('paperUrl').value,'https://');assert.equal(get('year').value,'20');
  assert.equal(get('tags').value.split(', ').length,21);
  assert.deepEqual(M.loadDraft(h.storage,draft.id).review,draft);
});
test('manual save during a draft transition cannot rebind the new draft to the old address',async()=>{
  let release,entered,count=0;const pending=new Promise(resolve=>entered=resolve);
  const locks={request:async(name,fn)=>{count++;if(count===1){entered();await new Promise(resolve=>release=resolve);}return fn();}};
  const h=await harness(locks),{get,form}=h;
  get('title').value='old draft input';form.handlers.input();
  const switching=get('new-draft').handlers.click();await pending;
  const extra=get('save-draft').handlers.click();release();await switching;await extra;
  const newId=new URL('https://example.org'+h.url).searchParams.get('draft');
  get('title').value='new draft input';form.handlers.input();await get('save-draft').handlers.click();
  assert.equal(M.loadDraft(h.storage,newId).review.title,'new draft input');
  assert.equal(M.loadDraft(h.storage,h.published.id).review.title,'old draft input');
});
test('session recovery does not depend on a failing draft store and keeps dirty input',async()=>{
  let restores=0,logins=0;
  const h=await harness(undefined,{session:true,restore:async()=>++restores>1,login:async()=>{logins++;}});
  h.get('title').value='dirty input kept while reconnecting';h.form.handlers.input();h.storage.setItem=()=>{throw Error('synthetic storage denied');};
  h.github.disconnect();await h.get('save-github').handlers.click();assert.equal(h.get('.editor-layout').hidden,true);
  await h.get('login-github').handlers.click();assert.equal(restores,2);assert.equal(logins,0);assert.equal(h.get('.editor-layout').hidden,false);assert.equal(h.get('title').value,'dirty input kept while reconnecting');assert.equal(h.get('editor-message').hidden,true);
});
test('expired login with unavailable draft storage opens a separate window and keeps the original input',async()=>{
  let loginOptions;
  const h=await harness(undefined,{session:true,restore:async()=>false,login:async options=>{loginOptions=options;}});
  h.get('title').value='unsaved original window input';h.form.handlers.input();h.storage.setItem=()=>{throw Error('synthetic storage denied');};
  h.github.disconnect();await h.get('save-github').handlers.click();await h.get('login-github').handlers.click();
  assert.equal(loginOptions.keepCurrent,true);assert.equal(h.get('title').value,'unsaved original window input');
  assert.match(h.get('auth-status').textContent,/새 창/);
});
