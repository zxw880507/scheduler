import React from 'react';
import {cleanup, getAllByTestId, getByAltText, getByText, render, waitForElement} from "@testing-library/react";
import Application from "components/Application";
import WS from "jest-websocket-mock";

afterEach(cleanup);


describe('Testing web-socket and relevant event handling', () => {

  // define action type and params
  let type, params;
  // creating an ENV test url
  const ENV = "ws://localhost:1234";
  test('one client booking an appointment will be synced on another client side over websocket ', async () => {
    // 1. Creating server-side websocket. 
    const server = new WS(ENV);

    // 2. Mocking the message that expecting to send back to another client.
    type = "SET_INTERVIEW";
    params = {id: 1, interview: { student: "Jack Zhao", interviewer: 2 }};
    const message = JSON.stringify({type, ...params});

    // 3. Render the Application.
    const {container} = render(<Application />);

    // 4. Waiting elements to load.
    await waitForElement(() => getByAltText(container, "Add"));
    const appointment = getAllByTestId(container, "appointment")[0];

    // 5. Waiting to connect with server and server send a message back.
    await server.connected;
    server.send(message);

    // 6. Client fetching the message and making an action then Checking if the appointment updates.
    await waitForElement(() => getByText(appointment, "Jack Zhao"));
    expect(getByText(appointment, "Jack Zhao")).toBeInTheDocument();

    // 7. Close server.
    server.close();
  });


  test('one client canceling an appointment will be synced on another client side over websocket ', async () => {
    // 1. Creating server-side websocket. 
    const server = new WS(ENV);

    // 2. Mocking the message that expecting to send back to another client.
    type = "SET_INTERVIEW";
    params = {id: 2};
    const message = JSON.stringify({type, ...params});

    // 3. Render the Application.
    const {container} = render(<Application />);

    // 4. Waiting elements to load.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];

    // 5. Waiting to connect with server and server send a message back.
    await server.connected;
    server.send(message);

    // 6. Client fetching the message and making an action then Checking if the appointment updates.
    await waitForElement(() => getByAltText(appointment, "Add"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    // 7. Close server.
    server.close();
  });




});

