import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "./Store";
import FractalGenerator from "./Views/FractalGenerator.jsx";
import {setBuffer, setCoefficients, setWindow, setColors} from "./Actions/Parameters.js";
import {DefaultProperties} from "./Constants/constants.js";

const rootEl = document.getElementById('root');

// Setup initial buffer
let buffer = [];
for(let i = 0; i < (DefaultProperties.width * DefaultProperties.height); i++) {
    buffer.push(0);
}

store.dispatch(setBuffer(buffer));
store.dispatch(setCoefficients());
store.dispatch(setWindow());
store.dispatch(setColors());

// Display the app
const render = () => {
    ReactDOM.render((
        <Provider store={store}>
            <FractalGenerator />
        </Provider>
        ), rootEl
    )
};

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(
      <RedBox error={error}/>,
      rootEl
    )
  };

  const renderHotLoad = () => {
    try {
      render()
    } catch (error) {
      renderError(error)
    }
  };

  module.hot.accept('./Views/FractalGenerator.jsx', () => {
    setTimeout(renderHotLoad)
  })
}

render();