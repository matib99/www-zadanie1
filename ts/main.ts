import { newGame } from './game.js';
import { quizEasy, quizMedium, quizHard } from './const.js';


console.log("początek");
const container = document.querySelector('div[class=container]');
console.log(container);
container.appendChild(newGame([quizEasy, quizMedium, quizHard]));
console.log("dość");