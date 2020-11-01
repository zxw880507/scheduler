
export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const getDay = state.days.filter(elem => elem.name === day) || [];
  return getDay.length && getDay[0].appointments ? getDay[0].appointments.reduce((init,id) => {
    init.push(state.appointments[id]);
    return init;
  }, []) : getDay;
};


export function getInterview(state, interview) {
  return interview ? {...interview, interviewer: state.interviewers[interview.interviewer]} :
  null;
};

export function getInterviewersForDay(state, day) {
  const getDay = state.days.filter(elem => elem.name === day) || [];
  return getDay.length && getDay[0].interviewers ? getDay[0].interviewers.reduce((init, id) => {
    init.push(state.interviewers[id]);
    return init;
  }, []) : getDay;
};
