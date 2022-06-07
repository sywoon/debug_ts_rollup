import { a1 } from './a';
import addArray from './b';
// import { Core } from './core';

const res1 = a1('kongzhi');
const res2 = addArray([1, 2, 3, 4]);

console.log(res1);
console.log(res2);

Core.init();
console.log(Core.timer.getTime())
