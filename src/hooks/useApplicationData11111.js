import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData() {
  /* setup state */
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  //updates spots if creates/deletes an appointment
  const updateDayWithSpots = (state, day) => {
    //some codes
    const getDay = state.days.filter(elem => elem.name === day);
    const spots = getDay.length && getDay[0].appointments.reduce((base, appointmentId) => {
      return state.appointments[appointmentId].interview ? base : ++base;
    }, 0);
    const days = state.days.map(eachDay => eachDay.name === day ? {...eachDay, spots} : {...eachDay});
    return days;
  }

   /* book/cancel interview */
   const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateDayWithSpots({...state, appointments}, state.day);
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(() => setState((prev) => ({...prev, appointments, days})));
    
  }
  /* cancel interview */
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    const days = updateDayWithSpots({...state, appointments}, state.day);
    return axios.delete(`/api/appointments/${id}`)
    .then(() => setState((prev) => ({...prev, appointments, days})));
  };
  /* fetching data from api/days */
  useEffect(() => {
    const endpoints = ["days", "appointments", "interviewers"];
    const promise = (endpoint) =>
      axios.get(`api/${endpoint}`).then((res) => res.data);

    Promise.all(endpoints.map((endpoint) => promise(endpoint))).then((res) =>
      setState((prev) => {
        return {
          ...prev,
          ...res.reduce((accu, current, index) => {
            accu[endpoints[index]] = current;
            return accu;
          }, {}),
        };
      })
    );
  }, []);



  return {state, setDay, bookInterview, cancelInterview};
}