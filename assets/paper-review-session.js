(function(root){
  'use strict';
  const M=typeof module!=='undefined'&&module.exports?require('./paper-review-model.js'):root.PaperReview;
  const G=typeof module!=='undefined'&&module.exports?require('./paper-review-github.js'):root.PaperReviewGitHub;
  const fail=code=>Object.assign(new Error(code),{name:'PaperReviewSessionError',code});
  async function importDrafts(storage,items,locks){
    let imported=0,skipped=0;if(!Array.isArray(items)||items.length>100||JSON.stringify(items).length>8_000_000)throw fail('invalid');
    for(const item of items){
      if(!item||item.version!==1||typeof item.savedAt!=='string'||!item.savedAt||Object.keys(M.reviewErrors(item.review,false)).length){skipped++;continue;}
      try{const result=await locks.request(M.PREFIX+item.review.id,()=>{if(storage.getItem(M.PREFIX+item.review.id)!==null)return false;return M.saveDraft(storage,item.review,null,item.savedAt).ok;});result?imported++:skipped++;}catch{skipped++;}
    }return {imported,skipped};
  }
  function collectDrafts(storage){
    const items=[];let size=0;for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!key?.startsWith(M.PREFIX))continue;
      try{const item=M.loadDraft(storage,key.slice(M.PREFIX.length));const length=JSON.stringify(item).length;if(items.length<100&&size+length<8_000_000){items.push({version:1,...item});size+=length;}}catch{}
    }return items;
  }
  function validOrigin(value,local=false){try{const url=new URL(value);return url.href===url.origin+'/'&&!url.username&&!url.password&&(url.protocol==='https:'||(local&&url.protocol==='http:'&&url.hostname==='127.0.0.1'))?url.origin:'';}catch{return '';}}
  async function receiveDrafts(context=root){
    const params=new URLSearchParams(context.location.search),source=params.get('source'),transfer=params.get('transfer');
    const local=context.location.hostname==='127.0.0.1';
    if(!context.opener||!/^[a-f0-9]{32}$/.test(transfer||'')||(source!=='https://sands15.github.io'&&!(local&&/^http:\/\/127\.0\.0\.1:\d+$/.test(source)&&validOrigin(source,true))))return null;
    return new Promise(resolve=>{
      const timeout=context.setTimeout(()=>finish(null),12000);
      function finish(result){context.clearTimeout(timeout);context.removeEventListener('message',receive);resolve(result);}
      async function receive(event){if(event.origin!==source||event.source!==context.opener||event.data?.type!=='relic-drafts'||event.data.transfer!==transfer)return;
        try{const result=await importDrafts(context.localStorage,event.data.items,context.navigator.locks);context.opener.postMessage({type:'relic-drafts-received',transfer,...result},source);finish(result);}catch{finish({imported:0,skipped:1});}
      }
      context.addEventListener('message',receive);context.opener.postMessage({type:'relic-drafts-request',transfer},source);
    });
  }
  function createClient(fetcher=root.fetch.bind(root),context=root){
    let csrf='',expires=0,bridge=false,legacy=null;
    async function request(path,{method='GET',body}={}){
      const headers={Accept:'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(method!=='GET')headers['X-Relic-CSRF']=csrf;
      try{
        const res=await fetcher(path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),credentials:'same-origin',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});
        if(res.status===404&&path==='/auth/session'){bridge=true;return null;}
        const raw=await res.text();if(raw.length>3_000_000)throw fail(method!=='GET'?'unknown':'invalid');let data;try{data=JSON.parse(raw);}catch{throw fail(method!=='GET'?'unknown':'invalid');}
        if(!res.ok){if(res.status===401||['owner','csrf'].includes(data.code)){csrf='';expires=0;}throw fail(['auth','owner','csrf','configured','validation','category','conflict','rate','permission','unknown','invalid','network'].includes(data.code)?data.code:'network');}
        return data;
      }catch(e){if(e.name==='PaperReviewSessionError')throw e;throw fail(method!=='GET'?'unknown':'network');}
    }
    async function restore(){csrf='';expires=0;try{const data=await request('/auth/session');if(!data)return false;if(data.login!=='sands15'||typeof data.csrf!=='string'||!Number.isFinite(data.expiresAt)||data.expiresAt<=Date.now())throw fail('auth');csrf=data.csrf;expires=data.expiresAt;return true;}catch(e){if(['auth','configured'].includes(e.code))return false;throw e;}}
    async function connect(value){if(value){legacy=G.createClient(fetcher);await legacy.connect(value);return true;}return login();}
    async function login({keepCurrent=false}={}){
      if(!bridge){await request('/auth/ready');const p=context.location.pathname+context.location.search,target='/auth/login?returnTo='+encodeURIComponent(p);if(keepCurrent){if(!context.open(target,'_blank'))throw fail('popup');}else context.location.assign(target);return false;}
      const config=await request('paper-review-auth.json'),local=context.location.hostname==='127.0.0.1',origin=validOrigin(config?.writerOrigin,local);if(!origin)throw fail('configured');
      const transfer=Array.from(context.crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join(''),url=new URL(origin+'/paper-review-write.html');
      const old=new URLSearchParams(context.location.search);for(const k of ['draft','edit'])if(M.ID.test(old.get(k)||''))url.searchParams.set(k,old.get(k));url.searchParams.set('source',context.location.origin);url.searchParams.set('transfer',transfer);
      const popup=context.open(url.href,'_blank');if(!popup)throw fail('popup');
      const timeout=context.setTimeout(()=>context.removeEventListener('message',send),15000);
      function send(event){if(event.origin!==origin||event.source!==popup||event.data?.transfer!==transfer)return;
        if(event.data.type==='relic-drafts-request'){try{popup.postMessage({type:'relic-drafts',transfer,items:collectDrafts(context.localStorage)},origin);}catch{}}
        if(event.data.type==='relic-drafts-received'){context.clearTimeout(timeout);context.removeEventListener('message',send);}
      }context.addEventListener('message',send);return false;
    }
    function owner(){if(!csrf||expires<=Date.now())throw fail('auth');}
    async function readReview(id){if(legacy)return legacy.readReview(id);owner();if(!M.ID.test(id||''))throw fail('validation');return request('/api/reviews/'+id);}
    async function saveReview(review,options={}){if(legacy)return legacy.saveReview(review,options);owner();if(!M.ID.test(review?.id||''))throw fail('validation');return request('/api/reviews/'+review.id,{method:'PUT',body:{review,expectedSha:options.expectedSha||null}});}
    async function readCategories(){if(legacy)return legacy.readCategories();owner();return request('/api/categories');}
    async function addCategory(name){if(legacy)return legacy.addCategory(name);owner();return request('/api/categories',{method:'POST',body:{name}});}
    async function disconnect(){if(legacy){legacy.disconnect();legacy=null;return;}const result=await request('/auth/logout',{method:'POST'});if(result?.loggedOut!==true)throw fail('network');csrf='';expires=0;}
    return {restore,connect,login,disconnect,get expiresAt(){return legacy?0:expires;},get persistent(){return !legacy;},get connected(){return legacy?legacy.connected:Boolean(csrf)&&expires>Date.now();},readReview,saveReview,readCategories,addCategory,checkDeployment:saved=>G.createClient(fetcher).checkDeployment(saved)};
  }
  const api={createClient,importDrafts,receiveDrafts};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PaperReviewSession=api;
})(typeof globalThis!=='undefined'?globalThis:window);
