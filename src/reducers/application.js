  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";


  export {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW};
  export default function reducer(state, action) {
    const { type } = action;
    switch (type) {
      // case "SET_DAY": {
      //   const { day } = action;
      //   return { ...state, day };
      // }
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
  };
