import {readingProblems} from '../core/data.js';
import {checkReading} from '../core/reading.js';
import {todayJst} from '../core/clock.js';
import {getAll,saveAnswer,saveSession} from '../core/db.js';
import {element,button,card,clear,header,note,statusMessage} from '../core/ui.js';
const LIMIT_MS=5*60_000;const labels={new:'新規学習',review:'白紙から復習',test:'未見の実力テスト'};
export function questionCandidates(data,mode,reviews,exposures,attempts){const rev=new Map(reviews.map(r=>[r.id,r]));const seen=new Set(exposures.map(e=>e.id));const answered=new Set(attempts.map(a=>a.problemId));const today=todayJst();return readingProblems(data).filter(p=>mode==='review'?rev.has(p.id)&&rev.get(p.id).dueDate<=today:mode==='test'?!seen.has('problem:'+p.id)&&!seen.has('vocab:'+p.vocab_id)&&!answered.has(p.id):!answered.has(p.id)).sort((a,b)=>a.id.localeCompare(b.id));}
export async function render(root,ctx,opts={}){const mode=['new','review','test'].includes(opts.mode)?opts.mode:'new';const data=ctx.data;
 const [reviews,exposures,attempts]=await Promise.all([getAll('reviews'),getAll('exposures'),getAll('attempts')]);if(ctx.signal?.aborted)return;
 const questions=questionCandidates(data,mode,reviews,exposures,attempts);
 if(!questions.length){clear(root,header('READ · '+labels[mode],'今日の分はクリア！'),card(element('h2',{text:'対象の問題はありません'}),element('p',{className:'muted',text:mode==='review'?'復習予定日になると問題が表示されます。':mode==='test'?'学習済みの語句と同じ語彙を使う問題は、未見のテストに出しません。':'新しい読み問題はすべて回答済みです。'}),button('ホームへ戻る',()=>ctx.navigate('home'))));return;}
 const start=performance.now();const sessionId=crypto.randomUUID();let index=0;let correct=0,wrong=0,finished=false;let visibleAt=performance.now();const dueAt=start+LIMIT_MS;const results=[];let tick=null;let liveTimer=null;
 const abort=()=>{if(tick!==null)clearInterval(tick);if(!finished){finished=true;const elapsed=Math.round(performance.now()-start);void saveSession({id:sessionId,mode,startedAt:new Date(Date.now()-elapsed).toISOString(),finishedAt:new Date().toISOString(),durationMs:elapsed,resultCount:results.length,correct,incorrect:wrong,reason:'interrupted',problemIds:results.map(r=>r.problemId)}).catch(e=>console.warn('Interrupted session save failed',e));}};ctx.signal?.addEventListener('abort',abort,{once:true});
 async function finish(reason='finished'){
  if(finished)return;finished=true;if(tick!==null)clearInterval(tick);const elapsed=Math.round(performance.now()-start);
  const session={id:sessionId,mode,startedAt:new Date(Date.now()-elapsed).toISOString(),finishedAt:new Date().toISOString(),durationMs:elapsed,resultCount:results.length,correct,incorrect:wrong,reason,problemIds:results.map(r=>r.problemId)};
  try{await saveSession(session);}catch(e){clear(root,statusMessage('セッション保存に失敗しました: '+String(e),'bad'));return;}if(ctx.signal?.aborted)return;
  const message=results.length===0?'また好きなタイミングで挑戦しよう。':correct===results.length?'取り組んだ問題はすべて正解。いい調子！':'今日やった分だけ前進。間違えた字は復習で確認しよう。';
  const summary=element('section',{className:'result-hero'},element('div',{className:'result-icon',text:'✓',attrs:{'aria-hidden':'true'}}),element('div',{className:'eyebrow',text:'GOOD WORK · おつかれさま'}),element('h1',{className:'h',text:'今日の一歩、できたね。'}),element('p',{className:'result-summary',text:message}));
  clear(root,summary,card(element('h2',{text:'今回の学習記録'}),element('div',{className:'result-grid'},element('div',{className:'result-kpi'},element('div',{className:'eyebrow',text:'○ 正解'}),element('div',{className:'stat',text:String(correct)})),element('div',{className:'result-kpi'},element('div',{className:'eyebrow',text:'△ 要確認'}),element('div',{className:'stat',text:'0'})),element('div',{className:'result-kpi'},element('div',{className:'eyebrow',text:'✕ 不正解'}),element('div',{className:'stat',text:String(wrong)}))),element('p',{className:'muted',text:`${Math.floor(elapsed/60000)}分${Math.round(elapsed%60000/1000)}秒 ／ ${results.length}問（読みの自動照合のみ）`}),element('div',{className:'actions'},button('ホームに戻る →',()=>ctx.navigate('home')),button('別のモードに挑戦',()=>ctx.navigate('quiz',{mode:mode==='new'?'review':'new'}),'button secondary'))));
 }
 async function show(){if(finished||ctx.signal?.aborted)return;if(index>=questions.length||performance.now()>=dueAt){await finish(performance.now()>=dueAt?'time-budget':'completed');return;}
  const p=questions[index];visibleAt=performance.now();let alreadyAnswered=false;
  const sentence=element('p',{className:'word-context'},document.createTextNode(p.sentence_before),element('span',{className:'word-highlight',text:p.sentence_target}),document.createTextNode(p.sentence_after));
  const input=element('input',{className:'input answer-box',attrs:{type:'text',lang:'ja',autocomplete:'off',autocapitalize:'off',spellcheck:'false',placeholder:'ここにひらがなで入力','aria-label':`「${p.sentence_target}」の読み`}});
  const form=element('form',{className:'stack'},element('label',{className:'answer-label',attrs:{for:'reading-answer'},text:'読みを入力して答えよう'}),input);input.id='reading-answer';
  let composing=false;input.addEventListener('compositionstart',()=>{composing=true;});input.addEventListener('compositionend',()=>{composing=false;});
  const feedback=element('div',{attrs:{role:'status','aria-live':'polite'}});
  const next=button('次の問題 →',()=>{index++;void show()},'button secondary');next.hidden=true;
  const submit=button('答え合わせ →',()=>form.requestSubmit(),'button quiz-submit');
  form.append(element('p',{className:'answer-hint',text:'選択肢はなし。思い出して入力してみよう。'}),submit);
  form.addEventListener('submit',async e=>{e.preventDefault();if(alreadyAnswered||composing||ctx.signal?.aborted)return;
   const answer=checkReading(input.value,p.accepted_answers);if(answer.kind==='invalid'){feedback.replaceChildren(statusMessage(answer.reason,'warn'));return;}
   alreadyAnswered=true;input.disabled=true;submit.disabled=true;
   try{const rec=await saveAnswer({problem:p,mode,answer:answer.normalized,result:answer.kind,sessionId,elapsedMs:performance.now()-visibleAt});results.push(rec);if(answer.kind==='correct')correct++;else wrong++;
    const message=answer.kind==='correct'?'○ 正解！いい調子！':`✕ 不正解。正しい読みは「${p.answer}」`;feedback.replaceChildren(statusMessage(message,answer.kind==='correct'?'good':'bad'));next.hidden=false;
   }catch(err){alreadyAnswered=false;input.disabled=false;submit.disabled=false;feedback.replaceChildren(statusMessage('保存できなかったため、解答を確定していません。再試行してください。'+String(err),'bad'));}
  });
  const remaining=Math.max(0,Math.ceil((dueAt-performance.now())/1000));liveTimer=element('span',{className:'quiz-timer',text:`残り ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`});
  const top=element('div',{className:'quiz-topline'},element('span',{className:'step-count',text:`QUESTION ${index+1} / ${questions.length}`}),liveTimer);
  const main=card(element('span',{className:'quiz-mode',text:labels[mode]}),element('div',{className:'quiz-topline'},top),element('div',{className:'progressbar',attrs:{role:'progressbar','aria-label':'問題の進捗','aria-valuemin':0,'aria-valuemax':questions.length,'aria-valuenow':index}},element('div',{attrs:{style:`width:${Math.round(index/questions.length*100)}%`}})),element('div',{className:'quiz-hero'},element('p',{className:'question-caption',text:'色のついた語句の読みを答えてね'}),sentence),form,feedback,element('div',{className:'actions'},next,button('ここで終了',()=>void finish('manual'),'button ghost')));
  clear(root,header('READ · 5分チャレンジ','考えて、思い出して、答える。'),main,note(mode==='new'?'新規学習の正解は定着とは数えません。翌日以降に白紙で復習します。':mode==='review'?'復習では回答前に見本を表示しません。':'未見の設問・語彙だけで実力を測ります。'));
  if(mode==='new'){
   form.hidden=true;
   const preview=element('div',{className:'feedback'},element('strong',{text:'まずおぼえよう'}),element('p',{text:`${p.sentence_target}（${p.answer}）`}),element('p',{className:'mini muted',text:'見本を隠したら自分で答えてみよう。'}));
   const practiceBtn=button('見本を隠してチャレンジ →',()=>{preview.remove();practiceBtn.remove();form.hidden=false;visibleAt=performance.now();input.focus();});
   form.before(preview,practiceBtn);
  }else input.focus();
 }
 await show();tick=setInterval(()=>{if(finished||ctx.signal?.aborted){clearInterval(tick);return;}const remaining=Math.max(0,Math.ceil((dueAt-performance.now())/1000));if(liveTimer)liveTimer.textContent=`残り ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;if(performance.now()>=dueAt)void finish('time-budget');},1000);
}
