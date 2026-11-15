import {todayJst,daysUntil,dateOrdinal} from '../core/clock.js';
import {getAll,getExamDate,setExamDate} from '../core/db.js';
import {readingProblems} from '../core/data.js';
import {studyMetrics,todayLabel} from '../core/stats.js';
import {element,button,card,clear,note} from '../core/ui.js';
export async function render(root,ctx){
 const data=ctx.data,problems=readingProblems(data);
 const [reviews,attempts,exposures,sessions,examDate]=await Promise.all([getAll('reviews'),getAll('attempts'),getAll('exposures'),getAll('sessions'),getExamDate()]);
 if(ctx.signal?.aborted)return;
 const stats=studyMetrics({attempts,reviews,exposures,sessions});
 const answered=new Set(attempts.map(a=>a.problemId));const fresh=problems.filter(p=>!answered.has(p.id)).length;
 const days=examDate?daysUntil(examDate):null;
 const hero=element('section',{className:'home-hero'},
   element('div',{className:'home-hero-inner'},
     element('div',{},
       element('div',{className:'hero-kicker',text:'TODAY · まずは5分'}),
       element('h1',{className:'hero-title',text:'今日も、1問ずつ。'}),
       element('p',{className:'hero-copy',text:todayLabel(stats)+`。未挑戦の読みはあと ${fresh} 問。`}),
       element('div',{className:'hero-action'},
         button(stats.due>0?'復習をはじめる →':'読みの学習をはじめる →',()=>ctx.navigate('quiz',{mode:stats.due>0?'review':'new'})),
         button('漢字をおぼえる',()=>ctx.navigate('learn'),'button secondary'))
     ),
     element('div',{className:'hero-ring',attrs:{style:`--progress:${stats.percent}`,'role':'img','aria-label':`今日の5分目標の進捗 ${stats.percent}%`}},
       element('div',{className:'ring-inside'},element('span',{text:'今日の達成'}),element('strong',{text:stats.percent+'%'}),element('small',{text:'目標 5分'})))
   )
 );
 const metrics=element('div',{className:'home-metrics'},
   element('section',{className:'metric'},element('div',{className:'metric-label',text:'復習する問題'}),element('div',{className:'metric-value accent',text:`${stats.due} 問`}),element('div',{className:'metric-sub',text:stats.due?'今日が復習期限':'今は復習待ちなし'})),
   element('section',{className:'metric'},element('div',{className:'metric-label',text:'学習の連続日数'}),element('div',{className:'metric-value',text:`${stats.streak} 日`}),element('div',{className:'metric-sub',text:'この端末の記録から集計'})),
   element('section',{className:'metric'},element('div',{className:'metric-label',text:'書けるようになった字'}),element('div',{className:'metric-value warm',text:'0 字'}),element('div',{className:'metric-sub',text:'Stage 2で白紙書き判定を開始'}))
 );
 const shortcuts=element('div',{className:'grid'},
   card(element('div',{className:'mode-tile'},element('span',{className:'mode-icon',text:'字',attrs:{'aria-hidden':'true'}}),element('div',{className:'mode-copy'},element('h3',{text:'学習カード'}),element('p',{text:'形・読み・意味・筆順を確認。まずは覚える時間。'}),element('div',{className:'mode-link'},button('カードを見る →',()=>ctx.navigate('learn'),'button secondary'))))),
   card(element('div',{className:'mode-tile'},element('span',{className:'mode-icon warm',text:'あ',attrs:{'aria-hidden':'true'}}),element('div',{className:'mode-copy'},element('h3',{text:'未見の実力テスト'}),element('p',{text:'まだ見ていない語句で、自分の実力をチェック。'}),element('div',{className:'mode-link'},button('実力を試す →',()=>ctx.navigate('quiz',{mode:'test'}),'button secondary')))))
 );
 const dateInput=element('input',{className:'input',attrs:{type:'date','aria-label':'入試日を設定'}});dateInput.value=examDate;
 const dateMsg=element('span',{className:'mini muted',attrs:{role:'status'}});
 const save=button('日付を保存',async()=>{try{if(dateInput.value&&dateOrdinal(dateInput.value)<dateOrdinal(todayJst()))throw Error('過去の日付は選べません');await setExamDate(dateInput.value);if(!ctx.signal?.aborted)await render(root,ctx);}catch(e){dateMsg.textContent='保存失敗：'+String(e);}},'button ghost');
 const countdown=days===null?'入試日を設定しよう':days<0?'新しい目標を設定しよう':days===0?'いよいよ今日！':`入試まで あと ${days} 日`;
 const exam=card(element('div',{className:'eyebrow',text:'YOUR GOAL · 試験日まで'}),element('h2',{text:countdown}),element('p',{className:'muted mini',text:'自分のペースで、今日できることを積み重ねよう。'}),element('div',{className:'date-control'},dateInput,save,dateMsg));
 clear(root,hero,metrics,element('h2',{className:'section-title',text:'自分に合ったモードで学ぼう'}),shortcuts,exam,note('検証版：書き取り10問は第2段で有効化します。全30問は要人間確認のAI下書きです。学習の記録はこの端末にだけ保存されます。'));
}
