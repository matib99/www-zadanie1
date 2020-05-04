import { newGame } from './game.js';
import { quizEasy, quizMedium, quizHard } from './const.js';


const container = document.querySelector('div[class=container]');
container.appendChild(newGame([quizEasy, quizMedium, quizHard]));