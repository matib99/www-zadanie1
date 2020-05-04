export interface IQuestion {
    id: number;
    expression: string;
    correctAnswer: number;
    playerAnswer: number;
    time: number;
    penalty: number;
    correct: boolean;
}

export interface IQuiz {
    name: string;
    introduction: string;
    questions: IQuestion[];
    currentQuestion: number;
    result: number;
}

export const spendTime = (question : IQuestion, time: number) => {
    question.time += time;
}

export const checkIfEverythingDone = (quiz : IQuiz) => {
    for( var question of quiz.questions ) {
        if( question.playerAnswer === undefined ) {
            return false;
        }
    }
    return true;
}

const errorPenaulty = ( i : number ) => {
    return i * 10;
}


export const calculateResult = (quiz : IQuiz) => {
    var result = 0;
    var mistakes = 0;
    for( var question of quiz.questions ) {
        

        result += question.time;
        var correct = (question.playerAnswer ===  question.correctAnswer);
        question.correct = correct;
        question.time = Math.round(question.time * 100) / 100;
        if( ! correct ) {
            mistakes ++;
            question.penalty = errorPenaulty(mistakes);
            result += question.penalty;
        }
    }
    result = Math.round(result * 100) / 100;
    quiz.result = result;
}

export const resetQuiz = (quiz : IQuiz) => {
    for( var question of quiz.questions ) {
        question.time = 0;
        question.correct = false;
        question.penalty = 0;
        question.playerAnswer = undefined;
    }
    quiz.currentQuestion = undefined;
    quiz.result = 0;
}






