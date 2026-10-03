import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import agent from '../api/agent';

vi.mock('../api/agent', () => ({
  default: {
    token: {
      get: vi.fn(),
      save: vi.fn(),
      destroy: vi.fn(),
    },
    Auth: {
      current: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      save: vi.fn(),
    },
  },
}));

const TestConsumer = () => {
  const { currentUser, isAuthenticated, isLoading, login, logout } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div data-testid="auth-state">{isAuthenticated ? 'AUTHENTICATED' : 'ANONYMOUS'}</div>
      <div data-testid="username">{currentUser?.username || 'none'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext and Permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes as anonymous when no token exists', async () => {
    agent.token.get.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-state')).toHaveTextContent('ANONYMOUS');
    expect(screen.getByTestId('username')).toHaveTextContent('none');
  });

  it('restores authenticated user when valid token is in storage', async () => {
    agent.token.get.mockReturnValue('valid-jwt-token');
    agent.Auth.current.mockResolvedValue({
      user: { username: 'johndoe', email: 'john@example.com', token: 'valid-jwt-token' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-state')).toHaveTextContent('AUTHENTICATED');
    expect(screen.getByTestId('username')).toHaveTextContent('johndoe');
  });

  it('destroys token and sets anonymous if stored token verification fails', async () => {
    agent.token.get.mockReturnValue('expired-token');
    agent.Auth.current.mockRejectedValue(new Error('401 Unauthorized'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-state')).toHaveTextContent('ANONYMOUS');
    expect(agent.token.destroy).toHaveBeenCalled();
  });

  it('saves token and updates state upon successful login', async () => {
    agent.token.get.mockReturnValue(null);
    agent.Auth.login.mockResolvedValue({
      user: { username: 'alice', email: 'alice@example.com', token: 'alice-jwt' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await screen.findByTestId('auth-state');

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(agent.Auth.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(agent.token.save).toHaveBeenCalledWith('alice-jwt');
    expect(screen.getByTestId('auth-state')).toHaveTextContent('AUTHENTICATED');
    expect(screen.getByTestId('username')).toHaveTextContent('alice');
  });

  it('destroys token and clears user on logout', async () => {
    agent.token.get.mockReturnValue('alice-jwt');
    agent.Auth.current.mockResolvedValue({
      user: { username: 'alice', email: 'alice@example.com', token: 'alice-jwt' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(await screen.findByTestId('auth-state')).toHaveTextContent('AUTHENTICATED');

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(agent.token.destroy).toHaveBeenCalled();
    expect(screen.getByTestId('auth-state')).toHaveTextContent('ANONYMOUS');
    expect(screen.getByTestId('username')).toHaveTextContent('none');
  });
});
