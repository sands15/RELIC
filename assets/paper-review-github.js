(function(root){
  'use strict';
  const M=typeof module!=='undefined'&&module.exports?require('./paper-review-model.js'):root.PaperReview;
  const API='https://api.github.com',REPO='/repos/sands15/RELIC',SITE='https://sands15.github.io/RELIC/';
  const HASH=/^[a-f0-9]{40}$/,CATEGORY_PATH='paper-review-categories.json';
  function fail(code){const e=new Error(code);e.name='PaperReviewGitHubError';e.code=code;return e;}
  function validCategories(value){return Array.isArray(value)&&value.length<=500&&value.every(n=>typeof n==='string'&&n.trim()===n&&n.length>0&&n.length<=80)&&new Set(value).size===value.length;}
  function encode(value){const bytes=new TextEncoder().encode(JSON.stringify(value,null,2)+'\n');let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary);}
  function decode(value){return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(value.replace(/\s/g,'')),c=>c.charCodeAt(0))));}
  function publicReview(r){if(Object.keys(M.reviewErrors(r)).length)throw fail('validation');return M.preparePublicReview(r,r.updatedAt);}
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function createClient(fetcher=root.fetch.bind(root)){
    let token='',authorized=false,session=0;
    function disconnect(){token='';authorized=false;session++;}
    function requireOwner(){if(!authorized||!token)throw fail('auth');}
    async function request(url,{method='GET',body,auth=false,missing=false}={}){
      const headers={'Accept':'application/vnd.github+json'};
      if(url.startsWith(API+'/'))headers['X-GitHub-Api-Version']='2026-03-10';
      if(auth){if(!token||!url.startsWith(API+'/'))throw fail('auth');headers.Authorization='Bearer '+token;}
      if(body)headers['Content-Type']='application/json';
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
      try{
        const response=await fetcher(url,{method,headers,body:body&&JSON.stringify(body),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer',redirect:'error',cache:'no-store'});
        if(response.status===404&&missing)return null;
        if(!response.ok){
          if(response.status===401&&auth){disconnect();throw fail('auth');}
          const limited=response.status===429||(response.status===403&&(response.headers?.get('x-ratelimit-remaining')==='0'||Boolean(response.headers?.get('retry-after'))));
          throw fail(limited?'rate':response.status===403?'permission':response.status===409||response.status===422?'conflict':'api');
        }
        const raw=await response.text();if(raw.length>3_000_000)throw fail('invalid');
        try{return JSON.parse(raw);}catch{throw fail('invalid');}
      }catch(e){if(e.name==='PaperReviewGitHubError'){if(method==='PUT'&&e.code==='invalid')throw fail('unknown');throw e;}throw fail(method==='PUT'?'unknown':'network');}
      finally{clearTimeout(timeout);}
    }
    async function connect(value){
      disconnect();const connecting=session;
      if(typeof value!=='string'||!value.trim()||/[\r\n]/.test(value))throw fail('auth');token=value.trim();
      try{
        const user=await request(API+'/user',{auth:true});
        if(user.login!=='sands15'||!Number.isSafeInteger(user.id))throw fail('owner');
        const repo=await request(API+REPO,{auth:true});
        if(repo.full_name!=='sands15/RELIC'||repo.owner?.id!==user.id)throw fail('owner');
        if(session!==connecting)throw fail('auth');authorized=true;
      }catch(e){if(session===connecting)disconnect();throw e;}
    }
    async function readFile(path,ref='main'){
      requireOwner();if(ref!=='main'&&!HASH.test(ref))throw fail('invalid');
      const data=await request(API+REPO+'/contents/'+path+'?ref='+ref,{auth:true,missing:true});
      if(!data)return null;
      if(data.type!=='file'||data.path!==path||data.encoding!=='base64'||!HASH.test(data.sha)||typeof data.content!=='string')throw fail('invalid');
      try{return {value:decode(data.content),sha:data.sha};}catch{throw fail('invalid');}
    }
    async function readReview(id){
      if(!M.ID.test(id||''))throw fail('validation');const file=await readFile('papers/'+id+'.json');
      if(file&&(file.value.id!==id||Object.keys(M.reviewErrors(file.value)).length))throw fail('invalid');
      return file&&{review:publicReview(file.value),sha:file.sha};
    }
    async function writeFile(path,value,old){
      requireOwner();const body={message:path===CATEGORY_PATH?'Add paper review category':'Save paper review '+value.id,content:encode(value),branch:'main'};if(old)body.sha=old.sha;
      const result=await request(API+REPO+'/contents/'+path,{method:'PUT',body,auth:true});
      try{
        if(result.content?.path!==path||!HASH.test(result.content.sha)||!HASH.test(result.commit?.sha))throw fail('unknown');
        const stored=await readFile(path,result.commit.sha);
        if(!stored||stored.sha!==result.content.sha||!same(stored.value,value))throw fail('unknown');
        return {sha:stored.sha,commitSha:result.commit.sha};
      }catch(e){if(e.code==='auth')throw e;throw fail('unknown');}
    }
    async function saveReview(value,{expectedSha=null}={}){
      requireOwner();const review=publicReview(value),path='papers/'+review.id+'.json',old=await readReview(review.id);
      if(old&&same(old.review,review))return {review,sha:old.sha,commitSha:null,alreadySaved:true};
      if(old?(!expectedSha||old.sha!==expectedSha||old.review.publishedAt!==review.publishedAt):Boolean(expectedSha))throw fail('conflict');
      return {...await writeFile(path,review,old),review,alreadySaved:false};
    }
    async function readCategories(){
      const file=await readFile(CATEGORY_PATH);if(file&&!validCategories(file.value))throw fail('invalid');return {categories:file?.value||[],sha:file?.sha||null};
    }
    async function addCategory(value){
      requireOwner();const name=typeof value==='string'?value.trim():'';if(!name||name.length>80)throw fail('category');
      const old=await readCategories();if(old.categories.includes(name))return {...old,commitSha:null,alreadySaved:true};
      const categories=[...old.categories,name];if(!validCategories(categories))throw fail('category');
      return {...await writeFile(CATEGORY_PATH,categories,old.sha?old:null),categories};
    }
    async function checkDeployment(saved){
      const review=publicReview(saved.review);let runState='unavailable';
      if(HASH.test(saved.commitSha||'')){
        try{
          const result=await request(API+REPO+'/actions/workflows/jekyll-gh-pages.yml/runs?head_sha='+saved.commitSha+'&per_page=5');
          const runs=(result.workflow_runs||[]).filter(r=>r.head_sha===saved.commitSha);
          runState=runs.some(r=>r.conclusion==='success')?'success':runs.some(r=>r.status==='completed'&&['failure','cancelled','timed_out','action_required'].includes(r.conclusion))?'failed':'pending';
        }catch{}
      }
      try{
        const suffix='?v='+(saved.commitSha||Date.now());
        const live=await request(SITE+'papers/'+review.id+'.json'+suffix,{missing:true});
        const catalog=await request(SITE+'papers/index.json'+suffix,{missing:true});
        const row=Array.isArray(catalog)&&catalog.find(r=>r.id===review.id);
        const fields=['id','title','summary','category','paperTitle','publishedAt','updatedAt'];
        if(live&&same(publicReview(live),review)&&row&&fields.every(k=>row[k]===review[k])&&same(row.tags,review.tags))return {state:'deployed',runState};
      }catch{}
      return {state:runState==='failed'?'failed':'pending',runState};
    }
    return {connect,disconnect,get connected(){return authorized&&Boolean(token);},readReview,saveReview,readCategories,addCategory,checkDeployment};
  }
  const api={createClient,validCategories};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PaperReviewGitHub=api;
})(typeof globalThis!=='undefined'?globalThis:window);
