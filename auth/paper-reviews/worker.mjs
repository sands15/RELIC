import M from '../../assets/paper-review-model.js';
import G from '../../assets/paper-review-github.js';

const MAX_SESSION=8*60*60*1000,MAX_FLOW=10*60*1000,SITE='https://sands15.github.io/RELIC/';
const error=code=>Object.assign(new Error(code),{code});
const bytes=value=>new TextEncoder().encode(value);
function base64(value){return btoa(String.fromCharCode(...value)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function unbase64(value){return Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
const nonce=()=>base64(crypto.getRandomValues(new Uint8Array(32)));
function configuration(env,request){
  const origin=new URL(request.url).origin,local=env.LOCAL_PREVIEW==='true'&&/^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
  if(origin!==env.PUBLIC_ORIGIN||(!local&&!origin.startsWith('https://'))||!env.GH_CLIENT_ID||!env.GH_CLIENT_SECRET||!/^\w{3,128}$/.test(env.GH_CLIENT_ID.replace(/\./g,'_'))||!/^[0-9a-f]{64}$/i.test(env.SESSION_KEY||''))throw error('configured');
  return {origin,local,session:local?'relic_session':'__Host-relic_session',flow:local?'relic_oauth':'__Host-relic_oauth'};
}
function cookie(name,value,age,local){return `${name}=${value}; Path=/; HttpOnly; ${local?'':'Secure; '}SameSite=Lax; Max-Age=${age}`;}
function getCookie(request,name){const parts=(request.headers.get('cookie')||'').split(';').map(v=>v.trim()).filter(v=>v.startsWith(name+'='));return parts.length===1?parts[0].slice(name.length+1):'';}
async function key(env){return crypto.subtle.importKey('raw',Uint8Array.from(env.SESSION_KEY.match(/../g),v=>parseInt(v,16)),{name:'AES-GCM'},false,['encrypt','decrypt']);}
async function seal(value,env,purpose){const iv=crypto.getRandomValues(new Uint8Array(12)),cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:bytes(purpose)},await key(env),bytes(JSON.stringify(value)));return base64(iv)+'.'+base64(new Uint8Array(cipher));}
async function open(value,env,purpose,time,maxAge){
  try{
    if(!value||value.length>3500)throw error('auth');const [iv,cipher,...extra]=value.split('.');if(extra.length)throw error('auth');
    const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(iv),additionalData:bytes(purpose)},await key(env),unbase64(cipher));
    const data=JSON.parse(new TextDecoder().decode(clear));
    if(data.origin!==env.PUBLIC_ORIGIN||!Number.isSafeInteger(data.issued)||!Number.isSafeInteger(data.expires)||data.issued>time||data.expires<=time||data.expires-data.issued>maxAge)throw error('auth');return data;
  }catch{throw error('auth');}
}
function response(value,status=200,cookies=[],location){
  const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'});
  for(const c of cookies)headers.append('Set-Cookie',c);if(location)headers.set('Location',location);
  return new Response(location?null:JSON.stringify(value),{status,headers});
}
function returnPath(value,origin){
  const target=new URL(value||'/paper-review-write.html',origin);
  if(target.origin!==origin||target.pathname!=='/paper-review-write.html')return '/paper-review-write.html';
  const p=new URLSearchParams();for(const field of ['draft','edit'])if(M.ID.test(target.searchParams.get(field)||''))p.set(field,target.searchParams.get(field));
  return target.pathname+(p.size?'?'+p:'');
}
async function readBody(request){
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))throw error('validation');
  const reader=request.body?.getReader();if(!reader)throw error('validation');const chunks=[];let length=0;
  try{while(true){const part=await reader.read();if(part.done)break;length+=part.value.length;if(length>2_000_000){await reader.cancel();throw error('validation');}chunks.push(part.value);}
    const all=new Uint8Array(length);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length;}return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(all));
  }catch{throw error('validation');}
}
export function createHandler({fetcher=globalThis.fetch.bind(globalThis),now=Date.now}={}){
  const githubFetch=(url,options={})=>fetcher(url,{...options,redirect:'manual',headers:{...options.headers,'User-Agent':'RELIC-Paper-Reviews'}});
  async function exchange(code,flow,env){
    let stage='exchange-fetch';
    try{
      const result=await githubFetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:env.GH_CLIENT_ID,client_secret:env.GH_CLIENT_SECRET,code,code_verifier:flow.verifier,redirect_uri:env.PUBLIC_ORIGIN+'/auth/callback'}),signal:AbortSignal.timeout(15000)});
      stage='exchange-read';const raw=await result.text();if(raw.length>10000)throw error('exchange');stage=result.ok?'exchange-format':result.status>=500?'exchange-server':'exchange-http';const token=JSON.parse(raw);
      const failures={incorrect_client_credentials:'credentials',redirect_uri_mismatch:'redirect',bad_verification_code:'code'};
      if(token.error)throw error(failures[token.error]||'exchange');
      if(!result.ok)throw error(stage);
      if(typeof token.access_token!=='string'||!token.access_token||token.access_token.length>512||/\s/.test(token.access_token)||token.token_type!=='bearer')throw error('exchange');return token;
    }catch(e){throw error(['credentials','redirect','code','exchange-server','exchange-http'].includes(e.code)?e.code:stage);}
  }
  return async function handle(request,env){
    const url=new URL(request.url),path=url.pathname;let config;
    try{
      if(!path.startsWith('/auth/')&&!path.startsWith('/api/')){
        if(path==='/'||path==='/paper-review-write.html')return env.ASSETS.fetch(new Request(url.origin+'/paper-review-write.html'+url.search,request));
        if(['/index.html','/paper-reviews.html','/paper-review.html'].includes(path))return response(null,302,[],SITE+path.slice(1)+url.search);
        return env.ASSETS.fetch(request);
      }
      config=configuration(env,request);
      const clears=[cookie(config.flow,'',0,config.local),cookie(config.session,'',0,config.local)];
      if(path==='/auth/ready'&&request.method==='GET')return response({ready:true});
      if(path==='/auth/login'&&request.method==='GET'){
        const time=now(),flow={origin:config.origin,issued:time,expires:time+MAX_FLOW,state:nonce(),verifier:nonce(),returnTo:returnPath(url.searchParams.get('returnTo'),config.origin)};
        const challenge=base64(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(flow.verifier))));
        const target=new URL('https://github.com/login/oauth/authorize');target.search=new URLSearchParams({client_id:env.GH_CLIENT_ID,redirect_uri:config.origin+'/auth/callback',state:flow.state,code_challenge:challenge,code_challenge_method:'S256'}).toString();
        return response(null,302,[cookie(config.flow,await seal(flow,env,'oauth'),600,config.local),clears[1]],target.href);
      }
      if(path==='/auth/callback'&&request.method==='GET'){
        let stage='flow';
        try{
          const time=now(),flow=await open(getCookie(request,config.flow),env,'oauth',time,MAX_FLOW);
          stage='state';
          if(url.searchParams.get('error')||!url.searchParams.get('code')||flow.state!==url.searchParams.get('state'))throw error('auth');
          stage='exchange';const token=await exchange(url.searchParams.get('code'),flow,env),client=G.createClient(githubFetch);
          stage='identity';await client.connect(token.access_token);
          const expiresIn=typeof token.expires_in==='number'&&token.expires_in>0?Math.min(token.expires_in*1000,MAX_SESSION):MAX_SESSION;
          const data={origin:config.origin,issued:time,expires:time+expiresIn,token:token.access_token,csrf:nonce()};
          stage='session';return response(null,303,[cookie(config.flow,'',0,config.local),cookie(config.session,await seal(data,env,'session'),Math.floor(expiresIn/1000),config.local)],flow.returnTo);
        }catch(e){const reason=['credentials','redirect','code','exchange-server','exchange-http','exchange-fetch','exchange-read','exchange-format'].includes(e.code)?e.code:stage;return response(null,303,clears,'/paper-review-write.html?auth='+(e.code==='owner'?'owner':'denied')+'&reason='+reason);}
      }
      const session=await open(getCookie(request,config.session),env,'session',now(),MAX_SESSION);
      if(!session.token||!session.csrf)throw error('auth');
      if(request.method!=='GET'&&(request.headers.get('origin')!==config.origin||request.headers.get('x-relic-csrf')!==session.csrf))throw error('csrf');
      if(path==='/auth/logout'&&request.method==='POST')return response({loggedOut:true},200,clears);
      const client=G.createClient(githubFetch);await client.connect(session.token);
      if(path==='/auth/session'&&request.method==='GET')return response({login:'sands15',expiresAt:session.expires,csrf:session.csrf});
      if(path==='/api/categories'){
        if(request.method==='GET')return response(await client.readCategories());
        if(request.method==='POST'){const body=await readBody(request);return response(await client.addCategory(body?.name));}
      }
      if(path.startsWith('/api/reviews/')){
        const id=path.slice('/api/reviews/'.length);if(!M.ID.test(id))throw error('validation');
        if(request.method==='GET')return response(await client.readReview(id));
        if(request.method==='PUT'){
          const body=await readBody(request);if(body?.review?.id!==id||(body.expectedSha!=null&&!/^[a-f0-9]{40}$/.test(body.expectedSha)))throw error('validation');
          return response(await client.saveReview(body.review,{expectedSha:body.expectedSha||null}));
        }
      }
      return response({code:'invalid'},404);
    }catch(e){
      const code=['auth','owner','csrf','configured','validation','category','conflict','rate','permission','unknown','invalid','network'].includes(e.code)?e.code:'network';
      const status={auth:401,owner:403,csrf:403,configured:503,validation:422,category:422,conflict:409,rate:429,permission:403}[code]||502;
      const clear=code==='auth'&&config?[cookie(config.session,'',0,config.local)]:[];return response({code},status,clear);
    }
  };
}
export default {fetch: (request,env)=>createHandler()(request,env)};
