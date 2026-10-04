(function(){
  'use strict';
  const M=window.PaperReview,R=window.PaperReviewRender,E=R.escape;
  const date=value=>M.validDate(value)?new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'2-digit',timeZone:'Asia/Seoul'}).format(new Date(value)):'';
  const detailUrl=id=>'paper-review.html?id='+encodeURIComponent(id);
  async function readJson(url){
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok)throw Error('자료를 불러올 수 없습니다.');
    const text=await response.text();if(text.length>2_000_000)throw Error('자료가 너무 큽니다.');
    return JSON.parse(text);
  }
  async function readReview(id){
    if(!M.ID.test(id||''))throw Error('리뷰 주소가 올바르지 않습니다.');
    const r=await readJson('papers/'+encodeURIComponent(id)+'.json');
    if(r.id!==id||Object.keys(M.reviewErrors(r)).length)throw Error('리뷰 파일을 읽을 수 없습니다.');
    return r;
  }
  function article(r,preview=false){
    const tags=r.tags.map(t=>'<span class="tag">#'+E(t)+'</span>').join('');
    const link=(url,label)=>M.safeUrl(url)?`<a class="text-link" href="${E(M.safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`:'';
    const heading=`<header class="article-heading"><span class="review-category">${E(r.category||'논문 리뷰')}</span>${r.title?'<h1>'+E(r.title)+'</h1>':''}${r.summary?'<p class="article-lead">'+E(r.summary)+'</p>':''}<div class="review-meta">${preview?'<span>초안 미리보기</span>':`<time datetime="${E(r.publishedAt)}">${date(r.publishedAt)}</time><span>손정훈</span>${r.updatedAt!==r.publishedAt?'<span>수정 '+date(r.updatedAt)+'</span>':''}`}</div><div class="tags">${tags}</div></header>`;
    const info=`<section class="paper-info" aria-label="논문 정보"><h2>논문 정보</h2>${r.paperTitle?'<p class="paper-title">'+E(r.paperTitle)+'</p>':''}${r.authors?'<p>'+E(r.authors)+'</p>':''}<p>${[r.venue,r.year&&r.year+'년'].filter(Boolean).map(E).join(' · ')}</p><div class="paper-info-links">${link(r.paperUrl,'논문 원문')}${link(r.codeUrl,'공개 코드')}</div></section>`;
    const cover=M.safeUrl(r.coverUrl)?`<figure class="article-body"><img src="${E(M.safeUrl(r.coverUrl))}" alt="${E(r.coverAlt)}" referrerpolicy="no-referrer">${r.coverAlt?'<figcaption>'+E(r.coverAlt)+'</figcaption>':''}</figure>`:'';
    return heading+info+cover+`<div class="article-body">${R.markdown(r.body)}</div>`;
  }
  window.PaperReviewUI={date,detailUrl,readReview,article};

  async function listPage(){
    const list=document.getElementById('review-list'),search=document.getElementById('review-search'),order=document.getElementById('review-order'),categoryArea=document.getElementById('categories'),pagination=document.getElementById('pagination');
    let rows=[],managedCategories=[],category='',selectedTags=[],page=1;const pageSize=15;
    const params=new URLSearchParams(location.search);search.value=params.get('q')||'';category=params.get('category')||'';selectedTags=params.getAll('tag');if(params.get('order')==='oldest')order.value='oldest';
    const tagFilter=document.createElement('div');tagFilter.className='tag-filter';tagFilter.setAttribute('aria-label','선택된 태그');document.querySelector('.filters').after(tagFilter);
    function syncUrl(){
      const p=new URLSearchParams();if(search.value.trim())p.set('q',search.value.trim());if(category)p.set('category',category);if(order.value!=='newest')p.set('order',order.value);selectedTags.forEach(t=>p.append('tag',t));if(page>1)p.set('page',String(page));history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():''));
    }
    function categories(){
      const names=[...new Set([...managedCategories,...rows.map(r=>r.category).filter(Boolean)])];
      categoryArea.innerHTML=['',...names].map(name=>`<button type="button" class="category-button" data-category="${E(name)}" aria-pressed="${category===name}"><span>${E(name||'전체 논문 리뷰')}</span><span>${name?rows.filter(r=>r.category===name).length:rows.length}</span></button>`).join('');
    }
    function render(){
      const filtered=M.selectReviews(rows,{query:search.value,category,order:order.value}).filter(r=>selectedTags.every(t=>r.tags.includes(t)));
      const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(Math.max(page,1),pages);
      document.getElementById('active-category').textContent=category||'전체 논문 리뷰';document.getElementById('results-count').textContent=filtered.length+'개의 게시글이 있습니다.';
      if(!filtered.length){
        const empty=rows.length===0;
        list.innerHTML=`<div class="empty"><div class="empty-mark" aria-hidden="true">≡</div><h2>${empty?'등록된 리뷰가 없습니다':'검색 결과가 없습니다'}</h2>${empty?'<a class="button primary" href="paper-review-write.html">리뷰 작성</a>':'<button type="button" id="reset-filters" class="button">전체 리뷰 보기</button>'}</div>`;
      }else{
        list.innerHTML=filtered.slice((page-1)*pageSize,page*pageSize).map(r=>`<article class="review-row no-cover"><h2><a href="${detailUrl(r.id)}">${E(r.title)}</a></h2><div class="review-meta"><time datetime="${E(r.publishedAt)}">▦ ${date(r.publishedAt)}</time></div><p class="review-summary">${E(r.summary||r.paperTitle)}</p>${r.tags.length?`<div class="tags"><span class="tags-label">Tags:</span>${r.tags.map(t=>`<button type="button" class="tag" data-tag="${E(t)}" aria-pressed="${selectedTags.includes(t)}">${E(t)}</button>`).join('')}</div>`:''}</article>`).join('');
      }
      tagFilter.innerHTML=selectedTags.map(t=>`<button type="button" class="button small" data-tag="${E(t)}" aria-label="${E(t)} 태그 필터 해제">${E(t)} ×</button>`).join('');
      pagination.innerHTML=pages>1?`<button type="button" data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">이전</button><span class="count-label">${page} / ${pages}</span><button type="button" data-page="${page+1}" ${page===pages?'disabled':''} aria-label="다음 페이지">다음</button>`:'';
      categories();syncUrl();list.setAttribute('aria-busy','false');
    }
    function toggleTag(t){selectedTags=selectedTags.includes(t)?selectedTags.filter(x=>x!==t):[...selectedTags,t];page=1;render();}
    categoryArea.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;page=1;render();}});
    search.addEventListener('input',()=>{page=1;render();});order.addEventListener('change',()=>{page=1;render();});
    list.addEventListener('click',e=>{const tag=e.target.closest('[data-tag]');if(tag)toggleTag(tag.dataset.tag);if(e.target.closest('#reset-filters')){search.value='';category='';selectedTags=[];page=1;render();}});
    tagFilter.addEventListener('click',e=>{const b=e.target.closest('[data-tag]');if(b)toggleTag(b.dataset.tag);});
    pagination.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b){page=Number(b.dataset.page);render();document.querySelector('.archive-main').scrollIntoView({block:'start'});}});
    try{
      rows=await readJson('papers/index.json');
      if(!Array.isArray(rows)||rows.some(r=>!M.ID.test(r.id||'')||!M.validDate(r.publishedAt)||['title','summary','category','paperTitle'].some(k=>typeof r[k]!=='string')||!Array.isArray(r.tags)||r.tags.some(t=>typeof t!=='string')))throw Error('Invalid catalog');
      try{const names=await readJson('paper-review-categories.json');if(!Array.isArray(names)||names.some(n=>typeof n!=='string'||!n.trim()||n.length>80))throw Error();managedCategories=names;}catch{const notice=document.createElement('p');notice.className='hint';notice.textContent='카테고리를 불러오지 못했습니다. 공개 글에 있는 카테고리만 표시합니다.';categoryArea.after(notice);}
      page=Math.max(1,Number(params.get('page'))||1);render();
    }catch{list.innerHTML='<div class="notice error"><p>리뷰 목록을 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.</p><button type="button" class="button" id="retry-list">다시 불러오기</button></div>';list.setAttribute('aria-busy','false');document.getElementById('results-count').textContent='불러오기 실패';document.getElementById('retry-list').addEventListener('click',()=>location.reload());}
  }
  async function detailPage(){
    const area=document.getElementById('review-detail'),id=new URLSearchParams(location.search).get('id');
    try{
      const r=await readReview(id);document.title=r.title+' | RELIC';area.innerHTML=article(r)+`<div class="reader-bottom"><a href="paper-reviews.html" class="button">← 목록으로</a><a href="paper-review-write.html?edit=${encodeURIComponent(id)}" class="text-link">리뷰 수정 준비</a></div>`;
      const headings=[...area.querySelectorAll('.article-body h2,.article-body h3,.article-body h4')];
      if(headings.length){const toc=document.createElement('details');toc.className='toc';toc.innerHTML='<summary>목차</summary><ol>'+headings.map(h=>`<li><a href="#${h.id}">${E(h.textContent)}</a></li>`).join('')+'</ol>';area.querySelector('.article-body').before(toc);}
    }catch{area.innerHTML='<div class="empty"><h1>리뷰를 불러올 수 없습니다</h1><p>주소를 확인하거나 배포가 완료된 뒤 다시 방문해 주세요.</p><a href="paper-reviews.html" class="button">논문 리뷰 목록</a></div>';}
    area.setAttribute('aria-busy','false');
  }
  if(document.body.dataset.page==='list')listPage();
  if(document.body.dataset.page==='detail')detailPage();
})();
