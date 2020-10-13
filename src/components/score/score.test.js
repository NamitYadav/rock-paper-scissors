import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { unmountComponentAtNode } from 'react-dom';

import Score from './score';
import rootReducer from '../../store/reducer';
import { render } from '@testing-library/react';

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
      <Score />
    </Provider>,
    container,
  );
});

test('renders two players', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Score />
    </Provider>,
  );
  const linkElement1 = getByText(/Player 1/i);
  const linkElement2 = getByText(/Player 2/i);
  expect(linkElement1).toBeInTheDocument();
  expect(linkElement2).toBeInTheDocument();
});
