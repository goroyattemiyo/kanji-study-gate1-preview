import {addDays,todayJst} from './clock.js';
export const REVIEW_INTERVALS=[1,3,7,14,30];
export function makeReview(problemId,date=todayJst()){return {problemId,kind:'reading',level:0,dueDate:addDays(date,1),lastAnsweredDate:date,attemptCount:0,correctCount:0,lastOutcome:null};}
export function advanceReview(previous,problemId,mode,correct,date=todayJst()){
 const current=previous??makeReview(problemId,date);
 // New-learning is a practice result; it doesn't count as spaced recall.
 const level = mode==='new'?0:correct?Math.min(current.level+1,REVIEW_INTERVALS.length-1):0;
 return {...current,level,dueDate:addDays(date,REVIEW_INTERVALS[level]),lastAnsweredDate:date,attemptCount:current.attemptCount+1,correctCount:current.correctCount+(correct?1:0),lastOutcome:correct?'correct':'incorrect'};
}
export function isDue(review,date=todayJst()){return review?.dueDate<=date;}
// Writing graduation is deliberately NOT awarded here. Stage 2 will track 3 correct
// blind responses across dates with a >=7-day interval, never infer it from reading.
export function writingGraduated(blindEvents){
 const correct=(blindEvents||[]).filter(e=>e.mode!=='new'&&e.result==='correct'&&e.hintUsed!==true).sort((a,b)=>a.date.localeCompare(b.date));
 const dates=[...new Set(correct.map(e=>e.date))];
 return correct.length>=3 && dates.length>=2 && correct.some(e=>correct.some(other=>other.date<e.date && (Date.parse(e.date+'T00:00:00Z')-Date.parse(other.date+'T00:00:00Z'))>=7*86400000));
}
