(async function(){
  'use strict';
  const M=window.PaperReview,UI=window.PaperReviewUI,form=document.getElementById('review-form'),body=document.getElementById('body'),status=document.getElementById('save-status'),message=document.getElementById('editor-message'),selector=document.getElementById('draft-select');
  const github=(window.PaperReviewSession||window.PaperReviewGitHub).createClient(),authStatus=document.getElementById('auth-status'),tokenInput=document.getElementById('github-token');
  let expiryTimer=null;
  let current=M.newDraft(),savedAt=null,dirty=false,timer=null,publicFile=null,loadFailed=false,revision=0,saving=null,operating=false,loading=true,initialized=false,authBusy=false,publishing=false,retryCandidate=null,lastSaved=null;
  const editorLayout=document.querySelector('.editor-layout');editorLayout.inert=true;editorLayout.hidden=true;
  const params=new URLSearchParams(location.search),editId=params.get('edit');
  let storage;try{storage=localStorage;}catch{storage=null;}
  const say=(text,error=false)=>{message.textContent=text;message.hidden=false;message.classList.toggle('error',error);};
  const errors={auth:'GitHub 로그인이 만료되었습니다. 다시 로그인하세요. 작성 중인 입력은 유지됩니다.',owner:'RELIC 소유자 sands15 계정만 작성할 수 있습니다.',permission:'GitHub의 RELIC 저장 권한을 확인해 주세요.',configured:'GitHub 로그인 연결 설정이 아직 완료되지 않았습니다.',popup:'새 작성 창을 열지 못했습니다. 이 사이트의 새 창 열기를 허용한 뒤 다시 시도하세요.',csrf:'로그인 상태를 다시 확인해 주세요. 현재 입력은 유지됩니다.',conflict:'GitHub의 글이 변경됐습니다. 현재 입력을 백업하고 최신 글을 가져온 후 수정하세요.',unknown:'저장 응답을 확인하지 못했습니다. 입력은 유지됩니다. 다시 저장하면 같은 내용이 반영됐는지 먼저 확인합니다.',network:'연결을 확인해 주세요. 현재 입력은 유지됩니다.',category:'카테고리 이름은 1~80자로 입력해 주세요. 최대 500개까지 추가할 수 있습니다.',rate:'GitHub 요청 한도에 도달했습니다. 잠시 후 다시 시도하세요.',invalid:'GitHub 파일 형식을 확인할 수 없습니다. 입력은 유지됩니다.'};
  function locked(){clearTimeout(expiryTimer);editorLayout.hidden=true;editorLayout.inert=true;document.getElementById('auth-connect').hidden=false;document.getElementById('disconnect-github').hidden=true;if(tokenInput)tokenInput.value='';const backupButton=document.getElementById('backup-auth');if(backupButton)backupButton.hidden=!initialized;}
  function report(error){if(!github.connected){locked();authStatus.textContent=errors[error.code]||'GitHub 인증을 다시 확인하세요.';}say(errors[error.code]||'GitHub 요청을 완료하지 못했습니다. 현재 입력은 유지됩니다.',true);}
  function categoryOptions(names){const options=document.getElementById('category-options');options.innerHTML='';for(const name of names){const option=document.createElement('option');option.value=name;options.append(option);}}
  function collect(){const r={...current};for(const field of M.TEXT_FIELDS)r[field]=form.elements[field].value;r.tags=form.elements.tags.value.split(',').map(s=>s.trim()).filter(Boolean);return r;}
  function fill(r){current=r;for(const field of M.TEXT_FIELDS)form.elements[field].value=r[field]||'';form.elements.tags.value=r.tags.join(', ');document.getElementById('body-count').textContent=r.body.length.toLocaleString('ko-KR')+'자';document.getElementById('publish-panel').hidden=true;publicFile=null;clearErrors();}
  function clearErrors(){form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));form.querySelectorAll('.field-error').forEach(e=>e.textContent='');}
  function refreshDrafts(){
    const old=selector.value,items=[];
    try{if(!storage)throw Error();for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!key?.startsWith(M.PREFIX))continue;const id=key.slice(M.PREFIX.length);try{const d=M.loadDraft(storage,id);items.push({id,title:d.review.title||'제목 없는 초안',savedAt:d.savedAt});}catch{items.push({id,title:'읽을 수 없는 초안 · 파일 백업으로 복구',savedAt:''});}}}catch{status.textContent='브라우저 저장을 사용할 수 없습니다. 초안 파일로 백업하세요.';}
    items.sort((a,b)=>b.savedAt.localeCompare(a.savedAt));selector.innerHTML='<option value="">초안 선택</option>';for(const item of items){const option=document.createElement('option');option.value=item.id;option.textContent=item.title;selector.append(option);}selector.value=old;
  }
  function save(){
    clearTimeout(timer);if(loading)return Promise.resolve(false);if(saving)return saving;
    saving=(async()=>{do{if(!await performSave())return false;}while(dirty);return true;})().finally(()=>{saving=null;});return saving;
  }
  async function performSave(){
    if(loadFailed){status.textContent='불러오기 실패 상태입니다. 새 리뷰를 시작하거나 파일을 가져오세요.';return false;}
    const r=collect();if(!storage){status.textContent='저장 공간을 사용할 수 없습니다. 초안 파일로 백업하세요.';return false;}
    const writingRevision=revision,result=await M.saveDraftLocked(storage,r,savedAt,navigator.locks);
    if(result.ok){current={...r,publishedAt:current.publishedAt||r.publishedAt,updatedAt:current.updatedAt||r.updatedAt,...(current._githubSha?{_githubSha:current._githubSha}:{})};savedAt=result.savedAt;dirty=revision!==writingRevision;status.textContent=dirty?'새 입력 저장 대기 중…':'이 브라우저에 저장됨 · '+new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});refreshDrafts();return true;}
    const reasons={conflict:'다른 탭에서 이 초안이 바뀌었습니다. 덮어쓰지 않았습니다. 현재 입력을 파일로 백업한 뒤 최신 초안을 가져오세요.',corrupt:'기존 초안이 손상되어 덮어쓰지 않았습니다. 현재 입력을 파일로 백업하세요.',storage:'임시저장에 실패했습니다. 입력은 유지됩니다. 초안 파일로 백업하세요.',unavailable:'이 브라우저에서는 안전한 임시저장을 지원하지 않습니다. HTTPS 주소의 최신 브라우저에서 열거나 초안 파일로 백업하세요.',invalid:'입력 형식이나 길이를 확인해 주세요. 현재 입력을 파일로 백업할 수 있습니다.'};
    status.textContent=reasons[result.reason]||'임시저장에 실패했습니다.';return false;
  }
  function changed(){revision++;dirty=true;retryCandidate=null;document.getElementById('publish-panel').hidden=true;publicFile=null;if(lastSaved){lastSaved.hasNewer=true;document.getElementById('github-save-status').textContent='GitHub에 저장한 내용 이후의 추가 입력이 있습니다. 다시 저장하세요.';}document.getElementById('body-count').textContent=body.value.length.toLocaleString('ko-KR')+'자';status.textContent='저장 중…';clearTimeout(timer);timer=setTimeout(save,700);}
  function backup(){download(current.id+'.draft.json',{version:1,kind:'relic-paper-draft',review:collect()});}
  function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function leaveCurrent(){
    while(true){if(await save()){if(!dirty)return true;}else{if(!dirty)return true;return confirm('현재 입력이 저장되지 않았습니다. 먼저 파일 백업을 권장합니다. 저장하지 않고 다른 초안을 열까요?');}}
  }
  async function operation(action){
    if(operating||loading)return;if(!github.connected){report({code:'auth'});return;}operating=true;
    const controls=['new-draft','draft-select','import-draft','prepare-publish','save-github','load-github-latest','add-category','disconnect-github','check-deployment'].map(id=>document.getElementById(id));controls.forEach(e=>e.disabled=true);
    try{return await action();}finally{operating=false;controls.forEach(e=>e.disabled=false);}
  }
  function showTab(preview){
    const writeTab=document.getElementById('tab-write'),previewTab=document.getElementById('tab-preview');writeTab.setAttribute('aria-selected',String(!preview));previewTab.setAttribute('aria-selected',String(preview));document.getElementById('write-panel').hidden=preview;document.getElementById('preview-panel').hidden=!preview;
    if(preview)document.getElementById('editor-preview').innerHTML=UI.article(collect(),true);
  }
  function switchDraft(r,stamp=null){revision++;clearTimeout(timer);savedAt=stamp;dirty=false;loadFailed=false;retryCandidate=null;lastSaved=null;document.getElementById('github-result').hidden=true;fill(r);message.hidden=true;showTab(false);status.textContent=stamp?'저장된 초안을 불러왔습니다.':'새 초안입니다. 입력하면 자동으로 임시저장합니다.';history.replaceState(null,'',location.pathname+'?draft='+encodeURIComponent(r.id));}
  form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',changed);
  document.getElementById('save-draft').addEventListener('click',save);
  document.getElementById('backup-draft').addEventListener('click',backup);
  document.getElementById('tab-write').addEventListener('click',()=>showTab(false));document.getElementById('tab-preview').addEventListener('click',()=>showTab(true));
  document.querySelector('.edit-tabs').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const preview=e.key==='End'||(e.key!=='Home'&&e.target.id==='tab-write');showTab(preview);document.getElementById(preview?'tab-preview':'tab-write').focus();}});
  selector.addEventListener('change',()=>operation(async()=>{const selected=selector.value;if(!selected)return;if(!await leaveCurrent()){selector.value=current.id;return;}try{const d=M.loadDraft(storage,selected);if(!d)throw Error();switchDraft(d.review,d.savedAt);}catch{say('초안을 읽을 수 없습니다. 현재 입력을 유지했습니다. 백업 파일을 가져오거나 새 리뷰를 시작하세요.',true);}}));
  document.getElementById('new-draft').addEventListener('click',()=>operation(async()=>{if(await leaveCurrent()){switchDraft(M.newDraft());document.getElementById('title').focus();}}));
  document.getElementById('import-draft').addEventListener('change',e=>operation(async()=>{
    const file=e.target.files[0];if(!file)return;
    try{
      if(file.size>2_000_000)throw Error('2MB 이하의 리뷰 파일을 선택해 주세요.');
      const value=JSON.parse(await file.text()),r=value.kind==='relic-paper-draft'?value.review:value;
      const errors=M.reviewErrors(r,value.kind!=='relic-paper-draft');if(Object.keys(errors).length)throw Error('리뷰 파일의 형식 또는 입력 값을 확인해 주세요.');
      if(!await leaveCurrent())return;
      let existing=null;try{existing=storage&&M.loadDraft(storage,r.id);}catch{throw Error('같은 주소의 손상된 초안이 있습니다. 기존 초안을 덮어쓰지 않았습니다.');}
      if(existing&&!confirm('같은 리뷰의 초안이 이 브라우저에 있습니다. 가져온 파일 내용으로 바꾸시겠습니까?'))return;
      switchDraft(r,existing?.savedAt||null);dirty=true;await save();say('파일을 가져왔습니다. 내용과 공개 범위를 확인한 뒤 이어서 작성하세요.');
    }catch(error){say(error.message||'파일을 읽을 수 없습니다. 현재 입력은 유지됩니다.',true);}finally{e.target.value='';}
  }));
  document.querySelector('.toolbar').addEventListener('click',e=>{
    const button=e.target.closest('[data-format]');if(!button)return;
    const selection=body.value.slice(body.selectionStart,body.selectionEnd),formats={heading:['\n## ','\n','소제목'],bold:['**','**','강조할 내용'],italic:['*','*','기울일 내용'],list:['\n- ','\n','목록 항목'],quote:['\n> ','\n','인용 내용'],code:['\n```\n','\n```\n','코드'],link:['[','](https://example.org)','링크 제목'],image:['\n![','](https://example.org/figure.png)\n','이미지 설명 / 출처'],table:['\n| 항목 | 내용 |\n| --- | --- |\n| ',' | 값 |\n','항목']};
    const [before,after,fallback]=formats[button.dataset.format],start=body.selectionStart;body.setRangeText(before+(selection||fallback)+after,start,body.selectionEnd,'end');body.focus();body.setSelectionRange(start+before.length,start+before.length+(selection||fallback).length);changed();
  });
  document.getElementById('insert-template').addEventListener('click',()=>{
    const template='## 읽게 된 이유\n\n\n## 핵심 요약\n\n\n## 문제 정의\n\n\n## 방법론\n\n\n## 실험과 결과\n\n\n## 장점과 한계\n\n\n## 나의 생각과 적용 아이디어\n\n\n## 참고 자료\n\n';
    const start=body.selectionStart;body.setRangeText((body.value?'\n\n':'')+template,start,body.selectionEnd,'end');body.focus();changed();
  });
  document.getElementById('prepare-publish').addEventListener('click',()=>operation(async()=>{
    clearErrors();if(loadFailed){say('기존 리뷰를 불러오지 못해 공개 파일을 만들 수 없습니다. 연결을 확인하고 다시 방문하세요.',true);return;}
    try{
      publicFile=M.preparePublicReview(collect());current={...current,publishedAt:publicFile.publishedAt};revision++;const preparingRevision=revision;dirty=true;await save();
      if(revision!==preparingRevision){say('입력이 변경되었습니다. 최신 내용으로 공개 준비를 다시 눌러 주세요.');return;}
      document.getElementById('publish-filename').textContent=publicFile.id+'.json';document.getElementById('publish-panel').hidden=false;document.getElementById('publish-panel').scrollIntoView({block:'center'});say('공개용 파일을 준비했습니다. 다운로드 후 GitHub에서 최종 반영하세요.');
    }catch(error){
      showTab(false);let first=null;for(const [field,text] of Object.entries(error.fields||{})){const input=form.elements[field],label=document.getElementById('error-'+field);if(input){input.setAttribute('aria-invalid','true');first=first||input;}if(label)label.textContent=text;}say('공개 준비를 위해 표시된 입력 항목을 확인해 주세요.',true);first?.focus();
    }
  }));
  document.getElementById('download-public').addEventListener('click',()=>{if(publicFile)download(publicFile.id+'.json',publicFile);});
  document.getElementById('save-github').addEventListener('click',()=>operation(async()=>{
    clearErrors();if(loadFailed){say('기존 글을 불러오지 못했습니다. 최신 글을 가져오거나 새 리뷰를 시작하세요.',true);return;}
    let candidate;try{candidate=retryCandidate?.revision===revision?retryCandidate.review:M.preparePublicReview(collect());}catch(error){showTab(false);let first=null;for(const [field,text] of Object.entries(error.fields||{})){const input=form.elements[field],label=document.getElementById('error-'+field);if(input){input.setAttribute('aria-invalid','true');first=first||input;}if(label)label.textContent=text;}say('저장하려면 표시된 입력 항목을 확인해 주세요.',true);first?.focus();return;}
    const writingRevision=revision;retryCandidate={review:candidate,revision};publishing=true;say('GitHub에 저장하고 저장된 원본을 확인하고 있습니다…');
    try{
      const saved=await github.saveReview(candidate,{expectedSha:current._githubSha||null});
      const newer=revision!==writingRevision;current={...current,publishedAt:saved.review.publishedAt,updatedAt:saved.review.updatedAt,_githubSha:saved.sha};revision++;dirty=true;retryCandidate=null;lastSaved={...saved,hasNewer:newer};
      document.getElementById('github-result').hidden=false;document.getElementById('deployed-review-link').hidden=true;
      document.getElementById('github-saved-link').href='https://github.com/sands15/RELIC/blob/'+(saved.commitSha||'main')+'/papers/'+saved.review.id+'.json';
      document.getElementById('github-save-status').textContent='GitHub 저장을 확인했습니다. 사이트 배포를 기다리고 있습니다.'+(newer?'\n저장 중 작성한 추가 입력은 아직 공개되지 않았습니다. 다시 저장하세요.':'');
      await save();say('GitHub에 저장했습니다. 배포가 끝나면 공개 목록에 나타납니다.'+(newer?' 추가 입력은 유지했습니다.':''));
    }catch(error){report(error);}finally{publishing=false;}
  }));
  document.getElementById('check-deployment').addEventListener('click',()=>operation(async()=>{
    if(!lastSaved)return;const saved=lastSaved;document.getElementById('github-save-status').textContent='사이트 반영을 확인하고 있습니다…';
    const result=await github.checkDeployment(saved);
    document.getElementById('github-save-status').textContent=result.state==='deployed'?'사이트의 글과 목록에 반영된 내용을 확인했습니다.':result.state==='failed'?'GitHub에는 저장됐지만 사이트 배포가 실패했습니다. 배포 진행에서 확인하세요.':'GitHub에는 저장됐습니다. 사이트 반영은 아직 확인되지 않았습니다. 잠시 후 다시 확인하세요.';
    if(saved.hasNewer)document.getElementById('github-save-status').textContent+='\n저장한 내용 이후의 추가 입력은 아직 공개되지 않았습니다. 다시 저장하세요.';
    if(result.state==='deployed'){const link=document.getElementById('deployed-review-link');link.href='https://sands15.github.io/RELIC/'+UI.detailUrl(saved.review.id);link.hidden=false;}
  }));
  document.getElementById('load-github-latest').addEventListener('click',()=>operation(async()=>{
    try{
      const target=loadFailed&&M.ID.test(editId||'')?editId:current.id,remote=await github.readReview(target);if(!remote){say('아직 GitHub에 저장된 글이 없습니다. 현재 입력을 유지했습니다.');return;}
      if(!await leaveCurrent()||!confirm('현재 입력을 GitHub 최신 글로 바꾸시겠습니까? 필요한 입력은 먼저 초안 파일로 백업하세요.'))return;
      let stamp=savedAt;if(target!==current.id){try{stamp=storage&&M.loadDraft(storage,target)?.savedAt||null;}catch{say('기존 초안이 손상되어 덮어쓰지 않았습니다. 파일로 백업하고 복구하세요.',true);return;}}
      switchDraft({...remote.review,_githubSha:remote.sha},stamp);dirty=true;await save();say('GitHub 최신 글을 가져왔습니다. 최초 발행일과 주소를 유지합니다.');
    }catch(error){report(error);}
  }));
  document.getElementById('add-category').addEventListener('click',()=>operation(async()=>{
    const categoryStatus=document.getElementById('category-status');categoryStatus.textContent='카테고리를 추가하고 있습니다…';
    try{const result=await github.addCategory(form.elements.category.value);categoryOptions(result.categories);categoryStatus.textContent=result.alreadySaved?'이미 추가한 카테고리입니다.':'GitHub에 카테고리를 추가했습니다. 배포 후 목록에도 표시됩니다.';}catch(error){categoryStatus.textContent=errors[error.code]||'카테고리를 추가하지 못했습니다. 다시 시도해 주세요.';report(error);}
  }));
  window.addEventListener('beforeunload',e=>{if(dirty||publishing){e.preventDefault();e.returnValue='';}});
  window.addEventListener('storage',e=>{if(!initialized)return;if(e.key===M.PREFIX+current.id){status.textContent='다른 탭에서 현재 초안이 변경됐습니다. 입력을 유지하며 덮어쓰기를 막습니다. 파일 백업 후 최신 초안을 가져오세요.';}refreshDrafts();});
  async function initialize(){try{
    if(editId){
      document.getElementById('editor-title').textContent='논문 리뷰 수정';form.inert=true;
      const remote=await github.readReview(editId);if(!remote)throw Error();const published=remote.review;let existing=null;try{existing=storage&&M.loadDraft(storage,editId);}catch{}
      switchDraft({...((existing?.review)||published),id:published.id,publishedAt:published.publishedAt,...(!existing?{_githubSha:remote.sha}:{})},existing?.savedAt||null);say('기존 리뷰를 불러왔습니다. 주소와 최초 발행일을 유지해 수정합니다.');form.inert=false;
    }else{
      const id=params.get('draft');if(id){const d=storage&&M.loadDraft(storage,id);if(d)switchDraft(d.review,d.savedAt);else switchDraft(current);}else switchDraft(current);
    }
  }catch{loadFailed=Boolean(editId);fill(current);form.inert=false;say(editId?'기존 리뷰를 불러오지 못했습니다. 연결을 확인하고 다시 방문하세요. 기존 글의 수정 파일은 준비할 수 없습니다.':'저장된 초안을 읽을 수 없습니다. 새 리뷰나 파일 백업으로 이어가세요.',true);}
    loading=false;initialized=true;refreshDrafts();
  }
  async function unlock(){
      if(!initialized)await initialize();
      if(!github.connected){locked();authStatus.textContent=errors.auth;return;}
      if([errors.auth,errors.csrf,errors.owner].includes(message.textContent))message.hidden=true;
      editorLayout.hidden=false;editorLayout.inert=false;document.getElementById('auth-connect').hidden=true;document.getElementById('disconnect-github').hidden=false;const backupButton=document.getElementById('backup-auth');if(backupButton)backupButton.hidden=true;authStatus.textContent=github.persistent?'sands15 로그인됨 · 같은 브라우저에서 최대 8시간 유지됩니다.':'sands15 계정 인증 완료 · 이 페이지가 닫히면 연결이 해제됩니다.';
      clearTimeout(expiryTimer);if(github.expiresAt)expiryTimer=setTimeout(()=>{locked();authStatus.textContent=errors.auth;},Math.max(0,github.expiresAt-Date.now()));
      try{categoryOptions((await github.readCategories()).categories);document.getElementById('category-status').textContent='';}catch(error){document.getElementById('category-status').textContent='카테고리 목록을 불러오지 못했습니다. 추가 버튼에서 다시 시도할 수 있습니다.';if(!github.connected)report(error);}
  }
  document.getElementById('connect-github')?.addEventListener('click',async()=>{
    if(authBusy||operating)return;authBusy=true;const value=tokenInput.value;tokenInput.value='';document.getElementById('connect-github').disabled=true;authStatus.textContent='GitHub 계정을 확인하고 있습니다…';
    try{await github.connect(value);await unlock();}catch(error){locked();authStatus.textContent=errors[error.code]||'GitHub에 연결하지 못했습니다. 다시 시도하세요.';}
    finally{authBusy=false;document.getElementById('connect-github').disabled=false;}
  });
  document.getElementById('login-github')?.addEventListener('click',async()=>{
    if(authBusy||operating)return;authBusy=true;
    try{if(await github.restore()){await unlock();return;}if(initialized&&dirty&&!await save()){await github.login({keepCurrent:true});authStatus.textContent='현재 입력을 이 창에 유지했습니다. 새 창에서 로그인한 뒤 돌아와 GitHub 로그인 버튼을 다시 누르세요. 초안 파일로도 백업할 수 있습니다.';return;}await github.login();}
    catch(error){authStatus.textContent=errors[error.code]||'GitHub 로그인으로 연결하지 못했습니다. 다시 시도하세요.';}finally{authBusy=false;}
  });
  document.getElementById('backup-auth')?.addEventListener('click',backup);
  document.getElementById('disconnect-github').addEventListener('click',async()=>{if(operating||authBusy)return;authBusy=true;try{if(dirty)await save();await github.disconnect();locked();message.hidden=true;authStatus.textContent='로그아웃했습니다. 다시 로그인하면 초안을 이어서 작성할 수 있습니다.';}catch(error){report(error);}finally{authBusy=false;}});
  tokenInput?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('connect-github').click();}});
  if(window.PaperReviewSession){
    try{const transferred=await window.PaperReviewSession.receiveDrafts();if(transferred)say('초안 '+transferred.imported+'개를 가져왔습니다. 기존 초안은 덮어쓰지 않았습니다.');if(await github.restore())await unlock();else if(params.get('auth'))authStatus.textContent=params.get('auth')==='owner'?errors.owner:'GitHub 로그인을 완료하지 못했습니다. 다시 시도하세요.';}
    catch(error){authStatus.textContent=errors[error.code]||'로그인 상태를 확인하지 못했습니다. 다시 시도하세요.';}
  }
})();
