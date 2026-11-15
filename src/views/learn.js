import {markExposure} from '../core/db.js';
import {element,button,card,clear,header,note,statusMessage} from '../core/ui.js';
let pathPromise;
async function getPaths(){return pathPromise??=(fetch('./data/kanjivg-paths.json').then(r=>{if(!r.ok)throw Error('KanjiVG not found');return r.json();}));}
const ns='http://www.w3.org/2000/svg';
function createSvg(paths){const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 109 109');svg.setAttribute('role','img');svg.setAttribute('aria-label','筆順見本アニメーション');
 let delay=0;for(const d of paths){const p=document.createElementNS(ns,'path');p.setAttribute('d',d);svg.append(p);const length=p.getTotalLength();p.style.setProperty('--stroke-len',String(length));p.style.setProperty('--duration',`${Math.max(.2,length/65)}s`);p.style.setProperty('--delay',`${delay}s`);p.style.strokeDasharray=String(length);delay+=Math.max(.2,length/65);}return svg;}
export async function render(root,ctx){const data=ctx.data,paths=(await getPaths()).chars;let index=0;
 async function show(){if(ctx.signal?.aborted)return;const k=data.kanji[index];
 const examples=k.examples.map(v=>element('li',{text:`${v.word}（${v.reading}）` }));
 const box=element('div',{className:'stroke-box animated'});box.append(createSvg(paths[k.character]||[]));
 const redraw=button('↻ 筆順をもう一度',()=>{box.classList.remove('animated');void box.offsetWidth;box.classList.add('animated');},'button secondary');
 const visual=element('div',{className:'study-visual'},element('div',{className:'kanji',text:k.character,attrs:{'aria-label':`漢字 ${k.character}`}}),box,element('div',{className:'actions'},redraw));
 const details=element('div',{className:'study-details'},element('div',{className:'eyebrow',text:'READ · UNDERSTAND'}),element('p',{className:'study-meaning',text:k.meaning}),element('dl',{},element('dt',{text:'読み方'}),element('dd',{text:k.readings.join('・')}),element('dt',{text:'意味'}),element('dd',{text:k.meaning}),element('dt',{text:'熟語の例'}),element('dd',{},element('ul',{},...examples))));
 const prev=button('← 前の漢字',()=>{index=Math.max(0,index-1);void show()},'button ghost');prev.disabled=index===0;
 const next=button('次の漢字 →',()=>{index=Math.min(data.kanji.length-1,index+1);void show()});next.disabled=index===data.kanji.length-1;
 const study=card(element('div',{className:'spaced'},element('span',{className:'eyebrow',text:`STUDY CARD · ${index+1} / ${data.kanji.length}`}),element('span',{className:'pill warn',text:'下書き・要人間確認'})),element('div',{className:'progressbar',attrs:{role:'progressbar','aria-label':'学習カードの位置','aria-valuenow':index+1,'aria-valuemin':0,'aria-valuemax':data.kanji.length}},element('div',{attrs:{style:`width:${Math.round((index+1)/data.kanji.length*100)}%`}})),element('div',{className:'study-layout'},visual,details),element('div',{className:'actions'},prev,next));
 clear(root,header('LEARN · 新規学習','形を見て、意味をつかもう。'),study,note('ここでは見本を見て学びます。カードを見たことは記録しますが、「白紙で書ける」とは判定しません。'));
 try{await markExposure('card:'+k.character);for(const v of k.examples)await markExposure('vocab:'+v.vocab_id);}catch(e){if(!ctx.signal?.aborted)root.append(statusMessage('学習履歴の保存に失敗: '+String(e),'bad'));}
 }
 await show();}
