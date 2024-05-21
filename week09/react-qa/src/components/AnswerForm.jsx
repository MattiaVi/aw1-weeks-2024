import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import dayjs from 'dayjs';

function AnswerForm(props) {
  //distinguo caso edit da caso add con mode, ma ache se c'è o mneo risposta defined o undefined 
  const [text, setText] = useState(props.answer ? props.answer.text : ''); //stato iniziale di default detto solo all’inizio o se refresh
  const [email, setEmail] = useState(props.answer ? props.answer.email : '');
  const [date, setDate] = useState(props.answer ? props.answer.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));

  const handleSubmit = (event) => {
    event.preventDefault(); //serve per prevenire comportamento di default -> ovvero chiamare la stessa pagina e fare un refresh 
    // creare un nuova risposta
    const answer = {text, email, date}; //passo tutto ad app così non importo risposta e soprattutto perché sa gli id 

    // TODO: aggiungere validazione
    //ad esempio che testo non sia vuota (in reltaà già form lo controlla, ma posso controllare che quei caratteri non siano due spazi )
    
    if(props.mode === 'edit') {
      // aggiornare la risposta in questione, ci serve id 
      props.updateAnswer({id: props.answer.id, ...answer}); 
    } else {
      // aggiungere la risposta allo stato
      props.addAnswer(answer); //in app 
    }
  }

  return(
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Text</Form.Label>
        <Form.Control type="text" required={true} minLength={2} value={text} onChange={(event) => setText(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>email</Form.Label>
        <Form.Control type="email" required={true} value={email} onChange={(event) => setEmail(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" value={date} onChange={(event) => setDate(event.target.value)}></Form.Control>
      </Form.Group>
      {props.mode==='add' && <Button variant='success' type='submit'>Add</Button>}
      {props.mode==='edit' && <Button variant='success' type='submit'>Update</Button>}{' '}
      <Button variant='danger' onClick={props.cancel}>Cancel</Button>
    </Form>
  );
}

export default AnswerForm;