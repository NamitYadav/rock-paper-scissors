import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { unmountComponentAtNode } from 'react-dom';

import GameTypeSelector from './game-type-selector';
import rootReducer from '../../store/reducer';
import { render } from '@testing-library/react';

const store = createStore(rootReducer);

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

it('renders without crashing', () => {
  ReactDOM.render(
    <Provider store={store}>
      <GameTypeSelector />
    </Provider>,
    container,
  );
});

test('renders game type options', () => {
  const { getByText } = render(
    <Provider store={store}>
      <GameTypeSelector />
    </Provider>,
  );
  const linkElement1 = getByText(/Player vs Computer/i);
  expect(linkElement1).toBeInTheDocument();

  const linkElement2 = getByText(/Computer vs Computer/i);
  expect(linkElement2).toBeInTheDocument();
});
