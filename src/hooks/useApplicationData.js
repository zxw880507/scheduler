// import {updateDayWithSpots} from "helpers/selectors";
import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    const { type } = action;
    switch (type) {
      case "SET_DAY": {
        const { day } = action;
        return { ...state, day };
      }
      case "SET_INTERVIEW": {
        const { id, interview } = action;

        const appointment = {
          ...state.appointments[id],
          interview: interview ? interview : null,
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        const days = state.days.map((day) => ({
          ...day,
          spots: day.appointments.reduce(
            (inital, appointmentId) =>
              appointments[appointmentId].interview ? inital : ++inital,
            0
          ),
        }));

        return { ...state, appointments, days };
      }

      case "SET_APPLICATION_DATA": {
        const { res, endpoints } = action;

        return {
          ...state,
          ...res.reduce((accu, current, index) => {
            accu[endpoints[index]] = current;
            return accu;
          }, {}),
        };

      }

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${type}`
        );
    }
  }
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
    /* sync updates */
    const eventHandler = (e) => {
      const data = JSON.parse(e.data);
      dispatch(data);
    };
    webSocket.addEventListener("message", eventHandler);

    /* fetching data from api/days */
    const endpoints = ["days", "appointments", "interviewers"];
    const promise = (endpoint) =>
      axios.get(`api/${endpoint}`).then((res) => res.data);

    Promise.all(endpoints.map((endpoint) => promise(endpoint))).then((res) =>
      dispatch({ type: SET_APPLICATION_DATA, res, endpoints })
    );

    return webSocket.addEventListener("close", eventHandler);
  }, []);

  return { state, setDay, setInterview };
}
