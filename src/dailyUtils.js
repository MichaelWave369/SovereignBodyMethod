import {journey} from './method.js';
import {dayRecipes} from './mealUtils.js';
import {practiceForDay} from './movementUtils.js';
export const SHARED_DAY_KEY='sovereign-body-method.meals.day.v1';
export const REFLECTION_KEY='sovereign-body-method.days.v1';
export const MOVEMENT_KEY='sovereign-body-method.movement.done.v1';
export const HYDRATION_KEY='sovereign-body-method.hydration.done.v1';

export function readDayPreference(value){
 const number=Number(value);
 return Number.isInteger(number)&&number>=1&&number<=30?number:1;
}
export function dailySources(day,recipes=[],schedule=null,water=[]){
 if(!Number.isInteger(day)||day<1||day>30)return null;
 return {
  day,reflection:journey[day-1],
  meals:dayRecipes(recipes,day),
  movement:practiceForDay(day,schedule),
  water:day<=28?(water.find(item=>item.day===day)||null):null,
  waterScheduleEnded:day>28
 };
}
export function dayProgress(day,reflectionDone,movementDone,hydrationDone){
 if(!Number.isInteger(day)||day<1||day>30)return null;
 const journey=reflectionDone.has(day);
 const movement=movementDone.has(day);
 const waterEligible=day<=28;
 const water=waterEligible&&hydrationDone.has(day);
 const completed=Number(journey)+Number(movement)+Number(water);
 return {journey,movement,water,waterEligible,completed,
  possible:waterEligible?3:2};
}
export function uniqueCompletedDays(...sets){
 const done=new Set();
 for(const list of sets)for(const value of list){
  if(Number.isInteger(value)&&value>=1&&value<=30)done.add(value);
 }
 return done.size;
}
