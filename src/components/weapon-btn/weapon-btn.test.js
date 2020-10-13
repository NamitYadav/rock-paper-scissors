import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { unmountComponentAtNode } from 'react-dom';

import WeaponBtn from './weapon-btn';
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
      <WeaponBtn />
    </Provider>,
    container,
  );
});

test('renders three weapons', () => {
  const { getByText } = render(
    <Provider store={store}>
      <WeaponBtn />
    </Provider>,
  );
  const linkElement1 = getByText(/Rock/i);
  const linkElement2 = getByText(/Paper/i);
  const linkElement3 = getByText(/Scissors/i);

  expect(linkElement1).toBeInTheDocument();
  expect(linkElement2).toBeInTheDocument();
  expect(linkElement3).toBeInTheDocument();
});
