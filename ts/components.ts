import { IQuestion, IQuiz, checkIfEverythingDone, calculateResult } from './quiz.js';

var timer : number;

export interface IQuizDisplay { 
    quiz: IQuiz;
    container: HTMLDivElement;
    introduction: HTMLParagraphElement;
    questionP: HTMLParagraphElement;
    answerInput: HTMLInputElement;
    prevBtn: HTMLButtonElement;
    nextBtn: HTMLButtonElement;
    endBtn: HTMLButtonElement;
} 

export const questionResultDiv = (question : IQuestion) => {
    const wrapper = document.createElement('div') as HTMLDivElement;
    const questionP = document.createElement('p') as HTMLParagraphElement;
    
    const answerStr = (question.correct) 
    ? `= ${question.correctAnswer}`
    : `≠ ${question.playerAnswer}. (Poprawna odpowiedź: ${question.correctAnswer})`;

    questionP.innerText = 
    `${question.id + 1})     ${question.expression} ${answerStr}\n
    Czas: ${question.time}s. ${(question.correct) ? '' : `, Kara: ${question.penalty}s.`}`;

    questionP.setAttribute('class', 'questionResultP');
    wrapper.setAttribute('class', `questionResultDiv${question.correct ? 'Correct' : 'Wrong'}`);
    wrapper.appendChild(questionP);

    return wrapper;
}

export const resultsDiv = (quiz : IQuiz) => {
    const resultsDiv = document.createElement('div') as HTMLDivElement;
    const resultsP = document.createElement('p') as HTMLParagraphElement;
    const backButton = document.createElement('button') as HTMLButtonElement;

    var best : number = parseFloat(localStorage.getItem(`best-${quiz.name}`));
    if (isNaN(best) || best > quiz.result) {
        best = quiz.result;
        localStorage.setItem(`best-${quiz.name}`, `${best}`);
    }
    


    backButton.setAttribute('class', 'backButton');
    backButton.textContent = 'Wróć';

    resultsDiv.setAttribute('class', 'resultsDiv');
    resultsP.setAttribute('class', 'resultsP');
    resultsP.innerText = `Twój wynik to: ${quiz.result}\n
    ${(quiz.result > best) ? `Rekord: ${best}` : `NOWY REKORD!!!`}`;

    resultsDiv.appendChild(resultsP);
    for(var question of quiz.questions){
        resultsDiv.appendChild(questionResultDiv(question));
    }
    resultsDiv.appendChild(backButton);
    return resultsDiv;
} 

export const startDiv = (quiz : IQuiz) => {
    const startDiv = document.createElement('div') as HTMLDivElement;
    const nameP = document.createElement('p') as HTMLParagraphElement;
    const introductionP = document.createElement('p') as HTMLParagraphElement;
    const bestP = document.createElement('p') as HTMLParagraphElement;
    const startButton = document.createElement('button') as HTMLButtonElement;
    const resetButton = document.createElement('button') as HTMLButtonElement;

    startButton.setAttribute('class', 'startButton');
    resetButton.setAttribute('class', 'resetButton');
    introductionP.setAttribute('class', 'startIntroduction');
    nameP.setAttribute('class', 'startName');
    startDiv.setAttribute('class', 'startDiv');
    const best = parseFloat(localStorage.getItem(`best-${quiz.name}`));
    bestP.textContent = `${(isNaN(best)) ? '' : `rekord: ${best}` }`;
    resetButton.disabled = isNaN(best);
    introductionP.innerText = quiz.introduction;
    nameP.textContent = quiz.name;
    startButton.textContent = `Rozpocznij!`;
    resetButton.textContent = `Resetuj Rekord`;

    startDiv.appendChild(nameP);
    startDiv.appendChild(introductionP);
    startDiv.appendChild(bestP);
    startDiv.appendChild(startButton);
    startDiv.appendChild(resetButton);

    return startDiv;
}


export const loadQuestion = (qDiv : IQuizDisplay, i : number) => {

    const max = qDiv.quiz.questions.length;
    if(i < 0 || i >= max)
        return;

    var prevID = qDiv.quiz.currentQuestion;
    if(prevID === undefined) {
        timer = performance.now();
    }
    else {
        var new_timer = performance.now();
        qDiv.quiz.questions[prevID].time += (new_timer - timer)/1000;
        timer = new_timer;
    }
    qDiv.quiz.currentQuestion = i;

    qDiv.nextBtn.disabled = ( i === max - 1);
    qDiv.prevBtn.disabled = ( i === 0);
    qDiv.nextBtn.onclick = () => {
        loadQuestion(qDiv, i+1);
    }
    qDiv.prevBtn.onclick = () => {
        loadQuestion(qDiv, i-1);
    }
    qDiv.endBtn.disabled = ! checkIfEverythingDone(qDiv.quiz);
    
    const question = qDiv.quiz.questions[i];

    qDiv.questionP.innerText = `Pytanie ${question.id}/${qDiv.quiz.questions.length}:\n${question.expression} = `;
    qDiv.answerInput.value = (question.playerAnswer !== undefined) 
        ? `${question.playerAnswer}` : ``;
    qDiv.answerInput.oninput = () => {
        const newAnswer = qDiv.answerInput.value as string;
        if(!newAnswer.match(/^-{0,1}\d+$/) &&  newAnswer != "") {
            alert(`"${newAnswer}" nie jest poprawną liczbą !!!`);
            return;
        }
        if( newAnswer == "")
            qDiv.quiz.questions[i].playerAnswer = undefined;
        else
            qDiv.quiz.questions[i].playerAnswer = parseInt(newAnswer);
        qDiv.endBtn.disabled = ! checkIfEverythingDone(qDiv.quiz);
    }
    qDiv.answerInput.focus();
}


export const setupQuizDisplay = (quiz : IQuiz) => {
    const quizDisplay : IQuizDisplay = {
        quiz: quiz,
        container: document.createElement('div'),
        introduction: document.createElement('p'),
        questionP: document.createElement('p'),
        answerInput: document.createElement('input'),
        prevBtn: document.createElement('button'),
        nextBtn: document.createElement('button'),
        endBtn: document.createElement('button'),
    }

    quizDisplay.introduction.setAttribute('class', 'quizIntroduction');
    quizDisplay.introduction.innerText = quiz.introduction;

    quizDisplay.endBtn.setAttribute('class', 'endButton');
    quizDisplay.endBtn.textContent = 'Sprawdź odpowiedzi';

    quizDisplay.nextBtn.setAttribute('class', 'nextButton');
    quizDisplay.nextBtn.textContent = 'następne';

    quizDisplay.prevBtn.setAttribute('class', 'prevButton');
    quizDisplay.prevBtn.textContent = 'poprzednie';

    quizDisplay.questionP.setAttribute('class', 'questionContent');

    quizDisplay.answerInput.setAttribute('class', 'answerInput');

    const buttonDiv = document.createElement('div');
    buttonDiv.appendChild(quizDisplay.prevBtn);
    buttonDiv.appendChild(quizDisplay.nextBtn);

    quizDisplay.container.setAttribute('class', 'quizDiv');
    quizDisplay.container.appendChild(quizDisplay.introduction);
    quizDisplay.container.appendChild(quizDisplay.questionP);
    quizDisplay.container.appendChild(quizDisplay.answerInput);
    quizDisplay.container.appendChild(buttonDiv);
    quizDisplay.container.appendChild(quizDisplay.endBtn);

    return quizDisplay;
}