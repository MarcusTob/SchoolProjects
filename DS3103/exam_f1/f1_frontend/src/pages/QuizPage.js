import QuizQuestions from "../components/quiz/QuizQuestions";

const QuizPage =() =>{

    return(
        <div>
            <h1 className="text-3xl p-2">Formula One Quiz</h1>
            <section>
                <QuizQuestions/>
            </section>
        </div>
    )
}
export default QuizPage;