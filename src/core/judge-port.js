// Stage 2 boundary. Do NOT load @tecack/* or the PoC judge during Stage 1.
// Contract: judge(input:{target,strokes,deviceType}) ->
// {aResult,bResult,combinedResult:'correct'|'review'|'incorrect',reasons:[],version:...}.
export async function loadWritingJudge(){throw Error('Gate 1 Stage 2: PoC v0.1.1 judge adapter not installed');}
