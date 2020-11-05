// import {updateDayWithSpots} from "helpers/selectors";
import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW} from "../reducers/application";




export default function useApplicationData() {
  
  
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  //set day
  const setDay = (day) => {
    const type = SET_DAY;
    dispatch({ type, day });
  };

  /* book/cancel interview */
  const setInterview = (id, interview = null) => {
    const type = SET_INTERVIEW;

    return (interview
      ? axios.put(`/api/appointments/${id}`, { interview })
      : axios.delete(`/api/appointments/${id}`)
    ).then(() => dispatch({ type, id, interview }));
  };


  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    /* websocket sync updates */
    const eventHandler = (e) => {
      const data = JSON.parse(e.data);
      dispatch(data);
    };
    webSocket.addEventListener("message", eventHandler);

    /* fetching data from api/days */
    const endpoints = ["days", "appointments", "interviewers"];
    const promise = (endpoint) =>
      axios.get(`/api/${endpoint}`).then((res) => res.data);

    Promise.all(endpoints.map((endpoint) => promise(endpoint))).then((res) =>
      dispatch({ type: SET_APPLICATION_DATA, res, endpoints })
    );
    
    return () => webSocket.close();
  }, []);

  return { state, setDay, setInterview };
}
