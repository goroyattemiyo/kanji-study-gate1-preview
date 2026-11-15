import {exportBackup,restoreBackup,downloadJson,getAll,getExamDate,setExamDate} from '../core/db.js';
import {element,button,card,clear,header,note,statusMessage} from '../core/ui.js';
export async function render(root,ctx){const [attempts,reviews,examDate]=await Promise.all([getAll('attempts'),getAll('reviews'),getExamDate()]);
 const status=element('div',{attrs:{role:'status','aria-live':'polite'}});
 const exportBtn=button('進捗をJSONで保存',async()=>{try{const data=await exportBackup();downloadJson(data,`kanji-progress-${new Date().toISOString().slice(0,10)}.json`);status.replaceChildren(statusMessage('JSONファイルの保存を開始しました。','good'));}catch(e){status.replaceChildren(statusMessage('出力失敗：'+String(e),'bad'));}});
 const importInput=element('input',{className:'input',attrs:{type:'file',accept:'.json,application/json','aria-label':'進捗JSONを読み込む'}});
 const importBtn=button('JSONから復元',async()=>{try{const file=importInput.files?.[0];if(!file)throw Error('JSONファイルを指定してください');if(file.size>5_000_000)throw Error('5MBを超えるファイルは読めません');const raw=JSON.parse(await file.text());const ok=confirm('この端末の進捗をバックアップの内容で完全に置き換えます。現在の履歴が失われます。続行しますか？');if(!ok)return;await restoreBackup(raw);status.replaceChildren(statusMessage('復元完了。画面を更新してください。','good'));}catch(e){status.replaceChildren(statusMessage('復元しませんでした：'+String(e),'bad'));}},'button ghost');
 const date=element('input',{className:'input',attrs:{type:'date','aria-label':'試験日'}});date.value=examDate;
 const dateBtn=button('試験日を保存',async()=>{try{await setExamDate(date.value);status.replaceChildren(statusMessage('試験日を保存しました。','good'));}catch(e){status.replaceChildren(statusMessage(String(e),'bad'));}},'button secondary');
 clear(root,header('PROGRESS','記録とバックアップ'),card(element('h2',{text:'この端末の進捗'}),element('p',{text:`回答 ${attempts.length} 件 ／ 復習対象 ${reviews.length} 問`}),element('p',{className:'callout',text:'端末間の自動同期はありません。別端末に移す際はエクスポート→インポートしてください。'})),card(element('h2',{text:'バックアップ・復元'}),element('div',{className:'stack'},exportBtn,importInput,importBtn),note('インポートは既存データを置き換えます。必ず先にバックアップを取得してください。')),card(element('h2',{text:'試験日'}),element('div',{className:'row'},date,dateBtn)),status);
}
