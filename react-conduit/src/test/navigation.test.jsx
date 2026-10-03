import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { AuthContext } from '../context/AuthContext';

describe('Header Navigation & Authentication States', () => {
  it('renders guest navigation links when unauthenticated', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, currentUser: null }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.queryByText(/New Article/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Settings/i)).not.toBeInTheDocument();
  });

  it('renders user navigation links and profile when authenticated', () => {
    const currentUser = {
      username: 'johndoe',
      image: 'https://example.com/john.jpg',
    };

    render(
      <AuthContext.Provider value={{ isAuthenticated: true, currentUser }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText(/New Article/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });
});
