/* eslint-disable react/prop-types */
import { Col, Row } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';

import Answers from './AnswerComponents';
import AnswerForm from './AnswerForm';
import { useState, useEffect } from 'react';
import API from '../API.mjs';
import { Answer } from '../QAModels.mjs';

export function QuestionLayout(props) {
  const [answers, setAnswers] = useState([]);

  // get the questionId from the URL to retrieve the right question and its answers
  const params = useParams();
  const question = props.questions[params.questionId-1];

  const getAnswers = async () => {
    const answers = await API.getAnswers(params.questionId);
    setAnswers(answers);
  }

  useEffect(() => {
    // recuperiamo tutte le risposte associate alla domanda specifica
    getAnswers();
  }, []);

  const voteUp = (answerId) => {
    // aggiornamento temporaneo
    setAnswers(oldAnswers => {
      return oldAnswers.map(ans => {
        if(ans.id === answerId) {
          // ritorno una nuova, aggiornata, risposta
          const answer = new Answer(ans.id, ans.text, ans.email, ans.date, ans.score +1);
          answer.voted = true; //oggetto javascript posso aggiungere e togliere prorpietà in ogni momento 
          //esiste solo se temporaneo e poi specifico in html che non posso rivoltarlo finché voted è a true 
          return answer;
        }
        else
          return ans;
      });
    });

    API.vote(answerId)
      .then(() => getAnswers())
      .catch(err => console.log(err));
  }

  return(
    <>
    {/* The check on "question" is needed to intercept errors due to invalid URLs (e.g., /questions/5 when you have two questions only)*/}
    {/*e anche quando questions è undefined (se navigo in app non ho problemi perchè ho già fatto use effect in altra parte, se uso url use effect non funziona) è come se dovessi dare tempo di caricare */}
    {/* dovuto al fatto che useeffect chiamato dopo e quindi ha conseguenze su applicazione */}
    {question ? <>
      <QuestionDescription question={question} />
      <Answers answers={answers} voteUp={voteUp}></Answers></> :
      <p className='lead'>The selected question does not exist!</p>
    } 
    </>
  );
}

export function AddEditQuestionLayout(props) {
  const { questionId } = useParams();
  const question = props.questions[questionId-1];
    
  let editableAnswer = undefined;
  if(props.mode === 'edit') {
    const location = useLocation();
    editableAnswer = location.state;
  }
  
  return(
  <> { question ? <>
    <QuestionDescription question={question} />
    <Row>
      <Col md={6} as='p'>
        <strong>Answer:</strong>
      </Col>
    </Row>
    { 
    props.mode === 'edit' && !editableAnswer ?
      <Row>
        <Col md={6}>
          <p>Answer not found!</p>
          <Link className='btn btn-danger' to={`/questions/${question.id}`}>Go back</Link>
        </Col>
      </Row>
      : <AnswerForm mode={props.mode} answer={editableAnswer} addAnswer={props.addAnswer} updateAnswer={props.updateAnswer}/>
    }</>: "Question doesn't exist" }
  </>
  );
}

function QuestionDescription (props) {
  return(
    <>
      <Row>
        <Col md={6} as='p'>
          <strong>Question #{props.question.id}:</strong>
        </Col>
        <Col md={6} as='p' className='text-end'>
          Asked by <span className='badge rounded-pill text-bg-secondary'>{props.question.email}</span>
        </Col>
      </Row>
      <Row>
        <Col as='p' className='lead'>{props.question.text}</Col>
      </Row>
    </>
  );
}
