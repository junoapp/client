import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './tailwind.css';

import App from './App';
import { UserProvider } from './contexts/user.context';

ReactDOM.render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
  document.getElementById('root')
);
