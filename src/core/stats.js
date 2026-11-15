import {todayJst,addDays} from './clock.js';
// Read-only presentation metrics. No inferred graduation from reading results.
export const DAILY_TARGET_MINUTES=5;
export function jstDateFromIso(iso){
 if(typeof iso!=='string'||!iso)return null;
 const date=new Date(iso);
 return Number.isNaN(date.getTime())?null:todayJst(date);
}
export function studyMetrics({attempts=[],sessions=[],exposures=[],reviews=[]},today=todayJst()){
 const days=new Set();let durationMs=0;
 for(const a of attempts){const d=a.date||jstDateFromIso(a.timestamp);if(d&&d<=today)days.add(d);}
 for(const s of sessions){const d=jstDateFromIso(s.finishedAt);if(d&&d<=today){days.add(d);if(d===today&&Number.isFinite(s.durationMs)&&s.durationMs>0)durationMs+=s.durationMs;}}
 for(const e of exposures){const d=jstDateFromIso(e.firstSeenAt);if(d&&d<=today)days.add(d);}
 // A session may cross midnight. Count today only when its finishing date is today.
 const completedMinutes=Math.min(DAILY_TARGET_MINUTES,Math.floor(durationMs/60000));
 const percent=Math.min(100,Math.max(0,Math.round(durationMs/(DAILY_TARGET_MINUTES*60000)*100)));
 let cursor=days.has(today)?today:addDays(today,-1),streak=0;
 while(days.has(cursor)){streak++;cursor=addDays(cursor,-1);}
 const due=reviews.filter(r=>typeof r.dueDate==='string'&&r.dueDate<=today).length;
 return {durationMs,completedMinutes,percent,streak,due,studiedToday:days.has(today),graduatedWriting:0,graduationEnabled:false};
}
export function todayLabel(metrics){return metrics.due>0?`復習 ${metrics.due} 問からスタート`:'今日は新しい読みを進めよう';}
