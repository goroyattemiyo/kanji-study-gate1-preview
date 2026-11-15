import {catalog} from './core/data.js';
import {openDb} from './core/db.js';
import {element} from './core/ui.js';
const root=document.getElementById('app');let generation=0;let activeController=null;
const views={home:()=>import('./views/home.js'),learn:()=>import('./views/learn.js'),quiz:()=>import('./views/quiz.js'),backup:()=>import('./views/backup.js')};
let context=null;
async function navigate(view,opts={}){
 activeController?.abort();activeController=new AbortController();const signal=activeController.signal;
 const gen=++generation;
 for(const n of document.querySelectorAll('[data-view]')){const yes=n.dataset.view===view;n.classList.toggle('active',yes);n.setAttribute('aria-current',yes?'page':'false');}
 root.replaceChildren(element('div',{className:'loading',text:'読み込み中…'}));
 try{
  const [module,data,db]=await Promise.all([views[view](),catalog(),openDb()]);
  if(gen!==generation)return;
  await module.render(root,{...context,data,db,signal},opts);
  if(gen===generation)root.focus({preventScroll:true});
 }catch(e){if(gen!==generation)return;const error=element('section',{className:'error',text:'画面の準備に失敗しました：'+String(e)});root.replaceChildren(error);}
}
context={navigate};
for(const el of document.querySelectorAll('[data-view]'))el.addEventListener('click',()=>navigate(el.dataset.view));
function online(){const el=document.getElementById('offline');el.textContent=navigator.onLine?'':'オフライン';}
window.addEventListener('online',online);window.addEventListener('offline',online);online();
// A service worker is limited to this app's subdirectory, not the existing PoC.
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(e=>console.warn('SW registration:',e));
navigate('home');
