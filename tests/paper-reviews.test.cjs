const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const modelPath = path.join(__dirname, '../assets/paper-review-model.js');
const renderPath = path.join(__dirname, '../assets/paper-review-render.js');
let M;
try { M = require(modelPath); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
let R;
try { R = require(renderPath); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
const fixture = (id, publishedAt, changes = {}) => ({version:1,id,title:'검증용 리뷰',summary:'테스트',category:'LLM',tags:['한국어'],paperTitle:'Synthetic paper',authors:'Test author',year:'2020',venue:'',paperUrl:'https://example.org/paper',codeUrl:'',coverUrl:'',coverAlt:'',body:'## 핵심 요약\n합성 입력입니다.',publishedAt,updatedAt:publishedAt,...changes});

test('sort uses review publication date, preserves input, and stabilizes equal dates', () => {
  assert.ok(M, 'review model has not been implemented');
  const rows=[fixture('old','2026-01-01T00:00:00.000Z',{year:'2030',updatedAt:'2026-10-04T00:00:00.000Z'}),fixture('z','2026-09-01T00:00:00.000Z'),fixture('a','2026-09-01T00:00:00.000Z',{year:'1990'})];
  assert.deepEqual(M.selectReviews(rows,{order:'newest'}).map(r=>r.id),['a','z','old']);
  assert.deepEqual(M.selectReviews(rows,{order:'oldest'}).map(r=>r.id),['old','a','z']);
  assert.deepEqual(rows.map(r=>r.id),['old','z','a']);
});
test('search and category filters compose over Korean tags and paper titles', () => {
  assert.ok(M, 'review model has not been implemented');
  const rows=[fixture('one','2026-01-01T00:00:00.000Z'),fixture('two','2026-01-02T00:00:00.000Z',{category:'Vision',tags:['이미지'],paperTitle:'Image model'})];
  assert.deepEqual(M.selectReviews(rows,{query:' 한국어 ',category:'LLM'}).map(r=>r.id),['one']);
  assert.deepEqual(M.selectReviews(rows,{query:'image',category:'LLM'}),[]);
});
test('public review export preserves existing address and publication time', () => {
  assert.ok(M, 'review model has not been implemented');
  const existing=fixture('keep-address','2026-01-01T00:00:00.000Z');
  const r=M.preparePublicReview({...existing,title:'  수정 글  ',privateNote:'must not export'},'2026-10-04T00:00:00.000Z');
  assert.equal(r.id,'keep-address'); assert.equal(r.publishedAt,existing.publishedAt);
  assert.equal(r.updatedAt,'2026-10-04T00:00:00.000Z');assert.equal(r.title,'수정 글');
  assert.equal(r.privateNote,undefined);
});
test('public export rejects unsafe URL, traversal ID, invalid date, and missing body', () => {
  assert.ok(M, 'review model has not been implemented');
  const base=fixture('safe','2026-01-01T00:00:00.000Z');
  for (const change of [{paperUrl:'javascript:alert(1)'},{coverUrl:'data:text/html,x'},{id:'../private'},{publishedAt:'2026-02-30T00:00:00.000Z'},{body:'  '}]) assert.throws(()=>M.preparePublicReview({...base,...change},'2026-10-04T00:00:00.000Z'));
});
test('draft store prevents stale tab overwrite and keeps a draft on failed save', () => {
  assert.ok(M, 'review model has not been implemented');
  const values=new Map();const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k),key:i=>[...values.keys()][i],get length(){return values.size}};
  const r=fixture('draft','2026-01-01T00:00:00.000Z');
  const first=M.saveDraft(storage,r,null,'t1');assert.equal(first.ok,true);
  assert.equal(M.saveDraft(storage,{...r,title:'new'},'t1','t2').ok,true);
  assert.equal(M.saveDraft(storage,{...r,title:'stale'},'t1','t3').reason,'conflict');
  assert.equal(M.loadDraft(storage,'draft').review.title,'new');
  const denied={getItem:()=>null,setItem:()=>{throw Error('denied')}};
  assert.equal(M.saveDraft(denied,r,null,'t4').reason,'storage');
});
test('incomplete paper fields remain recoverable drafts but cannot publish', () => {
  const r=fixture('incomplete','',{paperUrl:'https://',codeUrl:'ht',year:'20',tags:Array.from({length:21},(_,i)=>'태그'+i),publishedAt:'',updatedAt:''});
  assert.deepEqual(M.reviewErrors(r,false),{});
  const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  assert.equal(M.saveDraft(storage,r,null,'t1').ok,true);
  assert.deepEqual(M.loadDraft(storage,r.id).review,r);
  assert.throws(()=>M.preparePublicReview(r,'2026-10-04T00:00:00.000Z'));
});
test('reserved catalog address cannot be imported or published as a review', () => {
  const r=fixture('index','2026-01-01T00:00:00.000Z');
  assert.ok(M.reviewErrors(r,false).id);
  assert.throws(()=>M.preparePublicReview(r,'2026-10-04T00:00:00.000Z'));
});
test('browser-wide exclusive lock preserves the winning draft in simultaneous saves', async () => {
  const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  const r=fixture('parallel','2026-01-01T00:00:00.000Z');M.saveDraft(storage,r,null,'t0');
  let queue=Promise.resolve(),names=[];
  const locks={request(name,callback){names.push(name);const result=queue.then(callback);queue=result.catch(()=>{});return result;}};
  const results=await Promise.all([M.saveDraftLocked(storage,{...r,title:'A'},'t0',locks,'tA'),M.saveDraftLocked(storage,{...r,title:'B'},'t0',locks,'tB')]);
  assert.equal(results[0].ok,true);assert.equal(results[1].reason,'conflict');
  assert.equal(M.loadDraft(storage,r.id).review.title,'A');assert.equal(names[0],names[1]);
  assert.equal((await M.saveDraftLocked(storage,r,'tA',null)).reason,'unavailable');
});
test('public export uses absolute normalized URLs and strict string addresses', () => {
  const r=fixture('urls','2026-01-01T00:00:00.000Z',{paperUrl:'https:example.org/paper'});
  assert.throws(()=>M.preparePublicReview(r,'2026-10-04T00:00:00.000Z'));
  assert.throws(()=>M.preparePublicReview({...r,id:123,paperUrl:'https://example.org/paper'},'2026-10-04T00:00:00.000Z'));
  const valid=M.preparePublicReview({...r,paperUrl:' HTTPS://EXAMPLE.ORG/a b '},'2026-10-04T00:00:00.000Z');
  assert.equal(valid.paperUrl,'https://example.org/a%20b');
});
test('corrupt draft is reported without being replaced by a new autosave', () => {
  assert.ok(M, 'review model has not been implemented');
  let raw='{broken';const storage={getItem:()=>raw,setItem:v=>{raw=v}};
  assert.equal(M.saveDraft(storage,fixture('draft','2026-01-01T00:00:00.000Z'),null,'t').reason,'corrupt');
  assert.equal(raw,'{broken');
});
test('preview displays hostile HTML as text and never creates executable URLs', () => {
  assert.ok(R, 'safe preview has not been implemented');
  const html=R.markdown('<script>alert(1)</script>\n\n![x](javascript:alert) [x](data:text/html,hi)\n\n**요약** [원문](https://example.org/paper)');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script'));assert.ok(!/\b(?:href|src)="(?:javascript|data):/.test(html));
  assert.ok(html.includes('<strong>요약</strong>'));assert.ok(html.includes('href="https://example.org/paper"'));
});
test('review formatting preserves code, headings, lists, tables and image captions', () => {
  assert.ok(R, 'safe preview has not been implemented');
  const html=R.markdown('## 방법\n\n- 하나\n- 둘\n\n```python\nprint("<safe>")\n```\n\n| 모델 | 점수 |\n| --- | --- |\n| A | 1 |\n\n![설명](https://example.org/figure.png)');
  assert.ok(html.includes('<h2 id="section-1">방법</h2>'));assert.ok(html.includes('<li>둘</li>'));
  assert.ok(html.includes('print(&quot;&lt;safe&gt;&quot;)'));assert.ok(html.includes('<th>모델</th>'));
  assert.ok(html.includes('<figcaption>설명</figcaption>'));
});
