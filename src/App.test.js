import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { unmountComponentAtNode } from 'react-dom';

import App from './App';
import rootReducer from './store/reducer';

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
      <App />
    </Provider>,
    container,
  );
});

test('renders app header', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const linkElement = getByText(/Rock Paper Scissors/i);
  expect(linkElement).toBeInTheDocument();
});
