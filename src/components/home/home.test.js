import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { unmountComponentAtNode } from 'react-dom';

import Home from './home';
import rootReducer from '../../store/reducer';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const store = createStore(rootReducer);

it('renders without crashing', () => {
  ReactDOM.render(
    <Provider store={store}>
      <Home />
    </Provider>,
    container,
  );
});
