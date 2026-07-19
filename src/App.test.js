import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    getUserDisplayName: () => 'Test User',
    getUserHandle: () => 'testuser',
    getUserAvatar: () => null,
  }),
}));

test('renders without crashing', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
});
