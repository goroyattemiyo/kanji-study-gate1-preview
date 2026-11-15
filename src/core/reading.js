// Normalize kana only. Never infer a correct reading from a dictionary.
export function normalizeKana(value){return String(value??'').normalize('NFKC').replace(/\s+/g,'').replace(/[ァ-ヶ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0x60));}
export function isKanaAnswer(value){return /^[ぁ-ゖー]+$/.test(normalizeKana(value));}
export function checkReading(input,accepted){const normalized=normalizeKana(input);if(!isKanaAnswer(normalized))return {kind:'invalid',normalized,reason:'ひらがなで答えてください。'};const ok=accepted.some(a=>normalizeKana(a)===normalized);return {kind:ok?'correct':'incorrect',normalized,reason:ok?'正解です。':'正しい読みを確認して、次回は見ずに答えましょう。'};}
