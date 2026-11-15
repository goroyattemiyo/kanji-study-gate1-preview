// Calendar-day math is tied to JST, never the user's device time zone.
const f = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});
export function todayJst(date=new Date()) { const p=Object.fromEntries(f.formatToParts(date).map(p=>[p.type,p.value]));return `${p.year}-${p.month}-${p.day}`; }
export function dateOrdinal(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error('日付形式が不正');const [y,m,d]=value.split('-').map(Number);const stamp=Date.UTC(y,m-1,d);if(new Date(stamp).toISOString().slice(0,10)!==value)throw Error('実在しない日付');return Math.floor(stamp/86400000);}
export function daysUntil(day,now=todayJst()){return dateOrdinal(day)-dateOrdinal(now);}
export function addDays(day,n){return new Date((dateOrdinal(day)+n)*86400000).toISOString().slice(0,10);}
