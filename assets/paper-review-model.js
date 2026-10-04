(function (root) {
  'use strict';
  const PREFIX = 'relic.paper-draft.v1.';
  const TEXT_FIELDS = ['title','summary','category','paperTitle','authors','year','venue','paperUrl','codeUrl','coverUrl','coverAlt','body'];
  const ID = /^(?!index$)[a-z0-9][a-z0-9-]{0,79}$/;
  function safeUrl(value) {
    if (typeof value !== 'string' || !/^https?:\/\//i.test(value.trim())) return '';
    try { const url = new URL(value.trim()); return ['http:','https:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  }
  function validDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
  }
  function reviewErrors(r, published = true) {
    const errors = {};
    if (!r || typeof r !== 'object' || Array.isArray(r)) return {review:'리뷰 파일 형식을 확인해 주세요.'};
    if (r.version !== 1) errors.review = '지원하지 않는 리뷰 파일 버전입니다.';
    if (typeof r.id !== 'string' || !ID.test(r.id)) errors.id = '리뷰 주소가 올바르지 않습니다.';
    for (const field of TEXT_FIELDS) if (typeof r[field] !== 'string' || (published && r[field].length > (field === 'body' ? 200000 : 2000))) errors[field] = '입력 형식 또는 길이를 확인해 주세요.';
    if (!Array.isArray(r.tags) || r.tags.some(t=>typeof t !== 'string') || (published && (r.tags.length > 20 || r.tags.some(t=>!t.trim() || t.length > 80)))) errors.tags = '태그는 80자 이하로 최대 20개까지 입력할 수 있습니다.';
    if (!published && new TextEncoder().encode(JSON.stringify(r)).length > 1_900_000) errors.review = '초안은 1.9MB 이하로 작성해 주세요.';
    if (published) {
      for (const field of ['title','paperTitle','body']) if (typeof r[field] !== 'string' || !r[field].trim()) errors[field] = '이 항목을 입력해 주세요.';
      if (!r.paperUrl || !safeUrl(r.paperUrl)) errors.paperUrl = 'http 또는 https 원문 주소를 입력해 주세요.';
      for (const field of ['publishedAt','updatedAt']) if (!validDate(r[field])) errors[field] = '리뷰 날짜가 올바르지 않습니다.';
      if (validDate(r.publishedAt) && validDate(r.updatedAt) && r.updatedAt < r.publishedAt) errors.updatedAt = '수정일은 최초 발행일보다 빠를 수 없습니다.';
      for (const field of ['paperUrl','codeUrl','coverUrl']) if (r[field] && !safeUrl(r[field])) errors[field] = 'http 또는 https 주소만 사용할 수 있습니다.';
      if (r.year && !/^\d{4}$/.test(r.year)) errors.year = '발표연도는 네 자리 숫자로 입력해 주세요.';
    }
    return errors;
  }
  function preparePublicReview(draft, now = new Date().toISOString()) {
    const r = {version:1,id:draft.id};
    for (const field of TEXT_FIELDS) r[field] = typeof draft[field] === 'string' ? draft[field].trim() : draft[field];
    for (const field of ['paperUrl','codeUrl','coverUrl']) if (safeUrl(r[field])) r[field] = safeUrl(r[field]);
    r.tags = Array.isArray(draft.tags) ? [...new Set(draft.tags.map(t=>typeof t === 'string' ? t.trim() : t).filter(t=>t !== ''))] : draft.tags;
    r.publishedAt = draft.publishedAt || now; r.updatedAt = now;
    const errors = reviewErrors(r);
    if (Object.keys(errors).length) { const error = new Error('리뷰 입력을 확인해 주세요.'); error.fields = errors; throw error; }
    return r;
  }
  function selectReviews(rows, {query='',category='',order='newest'} = {}) {
    const needle = query.trim().toLocaleLowerCase();
    return rows.filter(r=>(!category || r.category === category) && (!needle || [r.title,r.summary,r.paperTitle,...(r.tags || [])].join(' ').toLocaleLowerCase().includes(needle))).slice().sort((a,b)=>{
      const date = String(a.publishedAt).localeCompare(String(b.publishedAt));
      return (order === 'oldest' ? date : -date) || a.id.localeCompare(b.id);
    });
  }
  function newDraft() {
    const r = {version:1,id:'review-'+Date.now().toString(36)+'-'+root.crypto.randomUUID().slice(0,8),tags:[],publishedAt:'',updatedAt:''};
    for (const field of TEXT_FIELDS) r[field] = '';
    return r;
  }
  function loadDraft(storage, id) {
    if (!ID.test(id || '')) throw Error('초안 주소가 올바르지 않습니다.');
    const raw = storage.getItem(PREFIX+id);
    if (!raw) return null;
    const envelope = JSON.parse(raw);
    if (envelope.version !== 1 || !envelope.savedAt || envelope.review?.id !== id || Object.keys(reviewErrors(envelope.review,false)).length) throw Error('초안 파일을 읽을 수 없습니다.');
    return envelope;
  }
  function saveDraft(storage, review, expected, stamp = new Date().toISOString()+'-'+root.crypto.randomUUID()) {
    try {
      let old;
      try { old = loadDraft(storage,review.id); } catch (e) { return {ok:false,reason:'corrupt'}; }
      if ((old?.savedAt || null) !== expected) return {ok:false,reason:'conflict'};
      if (Object.keys(reviewErrors(review,false)).length) return {ok:false,reason:'invalid'};
      storage.setItem(PREFIX+review.id,JSON.stringify({version:1,review,savedAt:stamp}));
      return {ok:true,savedAt:stamp};
    } catch { return {ok:false,reason:'storage'}; }
  }
  async function saveDraftLocked(storage, review, expected, locks, stamp) {
    if (!locks?.request) return {ok:false,reason:'unavailable'};
    try { return await locks.request(PREFIX+review.id,()=>saveDraft(storage,review,expected,stamp)); }
    catch { return {ok:false,reason:'storage'}; }
  }
  const api = {PREFIX,TEXT_FIELDS,ID,safeUrl,validDate,reviewErrors,preparePublicReview,selectReviews,newDraft,loadDraft,saveDraft,saveDraftLocked};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PaperReview = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
