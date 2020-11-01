import React, {useEffect} from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERRPR_DELETE";



export default function Appointment(props) {
  /* save an appointment */
  const onSave = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    // props.bookInterview(props.id, interview)
    props.setInterview(props.id, interview)
    .then(() => transition(SHOW)).catch(() => transition(ERROR_SAVE, true));

  }
  /* delete an appointment */
  const onDelete = () => {
    transition(DELETING, true);
    // props.cancelInterview(props.id)
    props.setInterview(props.id)
    .then(() => transition(EMPTY)).catch(() => transition(ERROR_DELETE, true));
  };
  /* confirm to delete an appointment */
  const confirmDelete = () => {
    transition(CONFIRM);
  };
  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  )
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      console.log("this is happening")
      transition(EMPTY);
    } 
  }, [props.interview, transition, mode]);
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
      {mode === SHOW && props.interview && (
      <Show 
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      onEdit={() => transition(EDIT)}
      onDelete={confirmDelete}
      />
      )}
      {mode === CREATE && (
        <Form
        interviewers={props.interviewers}
        onSave={onSave}
        onCancel={back}
        />
        )
      }
      {mode === EDIT && (
        <Form
        name={props.interview.student}
        interviewers={props.interviewers}
        interviewer={props.interview.interviewer.id}
        onSave={onSave}
        onCancel={back}
        />
      )
      }
      {mode === CONFIRM && (
        <Confirm 
        message="Are you sure you would like to delete?"
        onConfirm={onDelete}
        onCancel={back}
        />
      )}
      {(mode === SAVING || mode === DELETING) && (
        <Status message={mode}/>
      )}
      {(mode === ERROR_SAVE || mode === ERROR_DELETE) && (
        <Error 
        message={mode}
        onClose={back}
        />
      )}
    </article>
  );
}
