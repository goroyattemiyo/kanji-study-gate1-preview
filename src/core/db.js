import {advanceReview} from './srs.js';
import {todayJst,dateOrdinal} from './clock.js';
const DB_NAME='kanji-gate1-study';const DB_VERSION=1;
export const STORES=['settings','exposures','reviews','attempts','sessions'];
let openPromise;
export function openDb(){if(openPromise)return openPromise;if(!('indexedDB'in globalThis))return Promise.reject(Error('IndexedDBが利用できません。記録できないためテストを停止します。'));
 openPromise=new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const db=req.result;for(const name of STORES)if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:'id'});};req.onsuccess=()=>{req.result.onversionchange=()=>{req.result.close();openPromise=null;};resolve(req.result);};req.onerror=()=>reject(req.error||Error('DB open failure'));req.onblocked=()=>reject(Error('別タブがDB更新を妨げています'));}).catch(e=>{openPromise=null;throw e});return openPromise;}
function reqPromise(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
function finish(tx){return new Promise((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('保存エラー'));tx.onabort=()=>reject(tx.error||Error('保存処理を中断しました'));});}
export async function getItem(store,id){const db=await openDb();const tx=db.transaction(store,'readonly');const done=finish(tx);const value=await reqPromise(tx.objectStore(store).get(id));await done;return value??null;}
export async function getAll(store){const db=await openDb();const tx=db.transaction(store,'readonly');const done=finish(tx);const value=await reqPromise(tx.objectStore(store).getAll());await done;return value;}
export async function putItem(store,value){const db=await openDb();const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value);await finish(tx);}
export async function markExposure(id){if(await getItem('exposures',id))return;await putItem('exposures',{id,firstSeenAt:new Date().toISOString()});}
export async function getExamDate(){return (await getItem('settings','examDate'))?.value||'';}
export async function setExamDate(value){if(value){if(dateOrdinal(value)<dateOrdinal(todayJst()))throw Error('試験日に過去の日付は設定できません');}await putItem('settings',{id:'examDate',value});}
export async function saveAnswer({problem,mode,answer,result,sessionId,elapsedMs}){
 const db=await openDb();const date=todayJst();
 const tx=db.transaction(['attempts','exposures','reviews'],'readwrite');const done=finish(tx);
 const id=crypto.randomUUID();const attempt={id,problemId:problem.id,vocabId:problem.vocab_id,kind:problem.kind,mode,answer,verdict:result,date,timestamp:new Date().toISOString(),sessionId,elapsedMs,grading:'deterministic_kana',hintUsed:false};
 tx.objectStore('attempts').put(attempt);
 tx.objectStore('exposures').put({id:'problem:'+problem.id,firstSeenAt:attempt.timestamp});
 tx.objectStore('exposures').put({id:'vocab:'+problem.vocab_id,firstSeenAt:attempt.timestamp});
 const request=tx.objectStore('reviews').get(problem.id);
 request.onsuccess=()=>{const previous=request.result??null;tx.objectStore('reviews').put({id:problem.id,...advanceReview(previous,problem.id,mode,result==='correct',date)});};
 await done;return attempt;
}
export async function saveSession(session){await putItem('sessions',{...session,id:session.id});}
export function validateBackup(raw){if(!raw||raw.schema_version!==1||raw.app!=='kanji-gate1-study'||typeof raw.data!=='object'||raw.data===null)throw Error('対応していないバックアップ形式');
 for(const store of STORES){if(!Array.isArray(raw.data[store])||raw.data[store].length>200000)throw Error('バックアップの形式・件数が不正: '+store);const ids=new Set();for(const row of raw.data[store]){if(!row||typeof row!=='object'||typeof row.id!=='string'||row.id.length>200||ids.has(row.id))throw Error('不正なID: '+store);ids.add(row.id);}}
 for(const x of raw.data.attempts)if(!['reading','writing'].includes(x.kind)||!['new','review','test'].includes(x.mode)||!['correct','incorrect','review'].includes(x.verdict))throw Error('試行履歴が不正');
 for(const x of raw.data.reviews)if(!Number.isInteger(x.level)||x.level<0||x.level>4||typeof x.dueDate!=='string')throw Error('復習情報が不正');
 for(const x of raw.data.settings)if(x.id==='examDate'&&x.value){if(typeof x.value!=='string')throw Error('試験日の形式が不正');const n=Date.parse(x.value+'T00:00:00Z');if(!Number.isFinite(n)||new Date(n).toISOString().slice(0,10)!==x.value)throw Error('試験日が不正');}
 return true;
}
export async function exportBackup(){const data={};for(const store of STORES)data[store]=await getAll(store);return {app:'kanji-gate1-study',schema_version:1,app_version:'0.2.1-stage1-ui',exportedAt:new Date().toISOString(),data};}
export async function restoreBackup(raw){validateBackup(raw);const db=await openDb();const tx=db.transaction(STORES,'readwrite');for(const store of STORES){const object=tx.objectStore(store);object.clear();for(const row of raw.data[store])object.put(row);}await finish(tx);}
export function downloadJson(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
