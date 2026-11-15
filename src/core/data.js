let catalogPromise;
export function catalog(){if(!catalogPromise)catalogPromise=fetch('./data/catalog.v1.json').then(r=>{if(!r.ok)throw Error('問題データの取得に失敗');return r.json()}).then(value=>{validateCatalog(value);return value}).catch(e=>{catalogPromise=null;throw e});return catalogPromise;}
export function validateCatalog(value){
 if(value?.schema_version!==1||!Array.isArray(value.kanji)||!Array.isArray(value.vocabulary)||!Array.isArray(value.problems))throw Error('問題データ形式が不正');
 const ids=new Set();const voc=new Set(value.vocabulary.map(v=>v.id));const chars=new Set(value.kanji.map(k=>k.character));
 for(const p of value.problems){if(!p.id||ids.has(p.id)||!voc.has(p.vocab_id)||!['reading','writing'].includes(p.kind)||!p.human_review_required||p.approval_status!=='draft')throw Error('問題データ整合性エラー '+p.id);ids.add(p.id);if(!p.target_kanji.every(c=>chars.has(c)))throw Error('未登録漢字 '+p.id);if(!Array.isArray(p.accepted_answers)||!p.accepted_answers.length)throw Error('正答なし '+p.id)}
 return true;
}
export function readingProblems(data){return data.problems.filter(p=>p.kind==='reading');}
