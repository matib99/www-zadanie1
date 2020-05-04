import { IQuiz, calculateResult, resetQuiz  } from './quiz.js';
import { startDiv, setupQuizDisplay, IQuizDisplay, loadQuestion, resultsDiv } from './components.js';

export const newGame = (quizs : IQuiz[]) => {
    console.log("nowa gra...");
    const container = document.createElement('div') as HTMLDivElement;
    container.setAttribute('class', 'gameContainer');
    loadQuizs(quizs, container);
    return container;
}

const clearEl = (el : HTMLElement) => {
    var child = el.lastElementChild;  
    while (child) { 
        el.removeChild(child); 
        child = el.lastElementChild; 
    } 
}

const loadQuizs = (quizs : IQuiz[], container : HTMLDivElement) => {
    clearEl(container);
    for( var quiz of quizs) {
        const div = startDiv(quiz);
        const startBtn = div.getElementsByClassName('startButton')[0] as HTMLButtonElement
        const resetBtn = div.getElementsByClassName('resetButton')[0] as HTMLButtonElement
        const currQuiz = quiz;
        startBtn.onclick = () => {
            startQuiz(currQuiz, container, quizs);
        }
        resetBtn.onclick = () => {
            localStorage.removeItem(`best-${currQuiz.name}`);
            loadQuizs(quizs, container);
        }
        container.appendChild(div);
    }
    const rulesP = document.createElement('p') as HTMLParagraphElement;
    rulesP.setAttribute('class', 'rulesP');
    rulesP.innerText = `Zasady Oceniania:\n
    Im szybciej rozwiążesz quiz, tym lepiej.\n
    Za każdy błąd dodawane są karne sekundy.\n
    Za pierwszy błąd dodane jest 10s.\n
    Za każdy kolejny o 10s więcej.`
    container.appendChild(rulesP);
    
}

const startQuiz =  (quiz : IQuiz, container : HTMLDivElement, quizs : IQuiz[]) => {
    clearEl(container);
    var quizDisplay = setupQuizDisplay(quiz) as IQuizDisplay;
    const div = quizDisplay.container;
    quizDisplay.endBtn.onclick = () => {
        loadQuestion(quizDisplay, 0); // żeby sięczas naliczył
        calculateResult(quizDisplay.quiz);
        endQuiz(quiz, container, quizs);
    }
    
    loadQuestion(quizDisplay, 0);
    container.appendChild(div);
}

const endQuiz =  (quiz : IQuiz, container : HTMLDivElement, quizs : IQuiz[]) => {
    clearEl(container);
    
    const div = resultsDiv(quiz);
    const backBtn = div.querySelector('.backButton') as HTMLButtonElement;
    backBtn.onclick = () => {
        resetQuiz(quiz);
        loadQuizs(quizs, container);
    }

    container.appendChild(div);
}