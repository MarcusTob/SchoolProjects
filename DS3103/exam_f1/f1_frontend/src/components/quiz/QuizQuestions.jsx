import { useState } from "react"

const QuizQuestions =()=>{

    //array of all questions, answers and boolean; is correct, true of false
    const questions = [
        {
            questionTxt: "Who is the youngest driver in our database?",
            choices: [
                {answerTxt: "Lando Norris", isCorrect: true},
                {answerTxt: "Sergio Perez", isCorrect: false},
                {answerTxt: "Max Verstappen", isCorrect: false},
            ]
        },
        {
            questionTxt: "Who has won the most Formula 1 World Championships?",
            choices: [
                {answerTxt: "Sergio Perez", isCorrect: false},
                {answerTxt: "Fernando Alonso", isCorrect: false},
                {answerTxt: "Lewis Hamilton", isCorrect: true},
            ]
        },
        {
            questionTxt: "According to our database, who won the race in Saudi Arabia?",
            choices: [
                {answerTxt: "Max Verstappen", isCorrect: false},
                {answerTxt: "Sergio Perez", isCorrect: true},
                {answerTxt: "Carlos Sainz", isCorrect: false},
            ]
        },
        {
            questionTxt: "Which team does Fernando Alonso and Lando Norris drive for (according to our database)?",
            choices: [
                {answerTxt: "Mercedes", isCorrect: false},
                {answerTxt: "Ferrari", isCorrect: false},
                {answerTxt: "McLaren", isCorrect: true}
            ]
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isScoreVisible, setIsScoreVisible] = useState(false);
    const [score, setScore] = useState(0);
    const [previousScore, setPreviousScore] = useState(0);

    //when user clicks an answer, they get either +1 score if correct, or nothing if wrong
    const handleAnswerSubmit = (isCorrect) => {
        if(isCorrect===true){
            setScore(score +1)
        }
        //when user clicks an answer, next question gets displayed, if there is a next question
        const nextQuestion = currentQuestion + 1;
        if(nextQuestion < questions.length){
            setCurrentQuestion(nextQuestion);
        }
        //if there are no more questions, the "scorescreen" is displayed
        else{
            setIsScoreVisible(true);
        }
    }
    //resets question displayed and sets current score as "previous score" and saves it. current score gets set to 0
    const resetQuiz =()=>{
        setCurrentQuestion(0);
        setIsScoreVisible(false);
        setPreviousScore(score);
        setScore(0);
    }


return(
    <div>
        {/* this is displayed when all questions are answered */}
        {isScoreVisible && (
        <div>
            <p className="text-3xl p-3 text-center text-white">
                You got {score} correct out of {questions.length}
            </p>
            <button
                className="w-full m-5 p-2  text-white font-bold text-xl rounded"
                onClick={resetQuiz}
            >
                Try Again
            </button>
        </div>
        )}
        {/* this is displayed when there are still questions to be answered */}
        {!isScoreVisible &&(
        <div>
            <div>
                <p 
                    className="text-xl p-3 text-white"
                >Question {currentQuestion + 1} / {questions.length}
                </p>
                <div 
                className="text-4xl text-white font-bold p-3 text-center"
                >
                    {questions[currentQuestion].questionTxt}
                </div>
            </div>

            <div>
                <p 
                    className="text-xl p-5 text-white"
                >Choose answer</p>
                <div 
                className="p-3"
                >{questions[currentQuestion].choices.map((choices) =>
                    <li key={questions.index}>
                    (
                    <button 
                        className="bg-cyan-200 font-bold text-xl p-3 m-2 w-full"
                        onClick={()=>handleAnswerSubmit(choices.isCorrect)}
                    >
                        {choices.answerTxt}
                    </button>
                )
                </li>
                )}
                </div>
            </div>
            {/* shows the previous score */}
            <div>
                <p
                    className="font-bold text-lg p-5 text-white"
                >Your previous score: {previousScore} / {questions.length}</p>
            </div>
        </div>
        )}
    </div>
)
}

export default QuizQuestions;