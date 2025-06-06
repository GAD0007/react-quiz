import Header from "./Header";
import Main from "./main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./Startscreen";
import Question from "./Question";
import NextButton from "./NextButton";

import { useEffect, useReducer } from "react";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import RestartButton from "./RestartButton";

const initialstate = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
   secondsRemaining: 150 
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active",secondsRemaining: 150  };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
      case "nextQuestion": return {...state, index: state.index + 1, answer: null };
         case "finish": return {...state,status: "finished",highscore: state.points > state.highscore ? state.points : state.highscore};
         case "restart": return {...state,questions: action.payload, status: "restarted", index: 0, answer: null, points: 0};
 case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status:
          state.secondsRemaining - 1 === 0 ? "finished" : state.status,
        highscore:
          state.secondsRemaining - 1 === 0 && state.points > state.highscore
            ? state.points
            : state.highscore,
      };
    default:
      throw new Error("unknown action type");
  }
}

export default function App(params) {
  const [{ questions, status, index, answer,points,highscore,secondsRemaining }, dispatch] = useReducer(
    reducer,
    initialstate
  );
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev,cur)=> prev + cur.points, 0);
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((error) => {
        dispatch({ type: "dataFailed" });
      });
  }, []);
    useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    
    <div className="app">
      <Header />
      <Progress numQuestions={numQuestions} index={index} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>

      <Main />
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && (
        <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
      )}
      {status === "active" && (
        <>
         <div className="timer">
      Time left: {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, "0")}
    </div>
        <Question
        question={questions[index]}
        answer={answer}
        dispatch={dispatch}
        />
        <div className="flex-btn">
   <RestartButton dispatch={dispatch} answer={answer} questions={questions} index={index}/>
        <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index}/>
        </div>
     
        </>
      )}
      {status === "finished" && (
  <>
    <FinishedScreen
      points={points}
      maxPossiblePoints={maxPossiblePoints}
      highscore={highscore}
    />
    <div className="flex-btn">
      <RestartButton
        dispatch={dispatch}
        answer={answer}
        questions={questions}
        index={index}
      />
    </div>
  </>
)}
      {status === "restarted" && ( <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>)}


      <Main />
    </div>
  );
}
