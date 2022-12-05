class QuestionElement {
    qid: string;
    qInfo: string;
    title: string;
    question: string[];
    answersList: string[];
    answerType: string;
    options: Option[];
}

class Option {
    optTitle: string;
    optContent: string;
}


export { QuestionElement, Option };