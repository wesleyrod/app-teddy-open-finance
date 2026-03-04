import { render } from '@testing-library/react';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should render the login page by default', () => {
    const { baseElement } = render(<App />);
    // Unauthenticated users are redirected to login
    expect(baseElement.querySelector('form')).toBeTruthy();
  });
});
