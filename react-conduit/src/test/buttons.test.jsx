import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import FollowButton from '../components/FollowButton';
import { AuthContext } from '../context/AuthContext';
import agent from '../api/agent';

vi.mock('../api/agent', () => ({
  default: {
    Articles: {
      favorite: vi.fn(),
      unfavorite: vi.fn(),
    },
    Profile: {
      follow: vi.fn(),
      unfollow: vi.fn(),
    },
  },
}));

describe('FavoriteButton and FollowButton logic and guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FavoriteButton', () => {
    it('redirects to /register if unauthenticated user clicks favorite', async () => {
      const article = { slug: 'test-slug', favorited: false, favoritesCount: 3 };

      render(
        <AuthContext.Provider value={{ isAuthenticated: false }}>
          <MemoryRouter initialEntries={['/article/test-slug']}>
            <Routes>
              <Route path="/article/test-slug" element={<FavoriteButton article={article} />} />
              <Route path="/register" element={<div data-testid="register-page">Register Page</div>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      act(() => {
        screen.getByRole('button').click();
      });

      expect(screen.getByTestId('register-page')).toBeInTheDocument();
      expect(agent.Articles.favorite).not.toHaveBeenCalled();
    });

    it('toggles to favorited and increments count when authenticated', async () => {
      const article = { slug: 'test-slug', favorited: false, favoritesCount: 3 };
      agent.Articles.favorite.mockResolvedValue({});

      render(
        <AuthContext.Provider value={{ isAuthenticated: true }}>
          <MemoryRouter>
            <FavoriteButton article={article} />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByText('(3)')).toBeInTheDocument();

      await act(async () => {
        screen.getByRole('button').click();
      });

      expect(agent.Articles.favorite).toHaveBeenCalledWith('test-slug');
      expect(screen.getByText('(4)')).toBeInTheDocument();
      expect(screen.getByText(/Unfavorite Article/i)).toBeInTheDocument();
    });

    it('toggles to unfavorited and decrements count when already favorited', async () => {
      const article = { slug: 'test-slug', favorited: true, favoritesCount: 10 };
      agent.Articles.unfavorite.mockResolvedValue({});

      render(
        <AuthContext.Provider value={{ isAuthenticated: true }}>
          <MemoryRouter>
            <FavoriteButton article={article} />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByText('(10)')).toBeInTheDocument();

      await act(async () => {
        screen.getByRole('button').click();
      });

      expect(agent.Articles.unfavorite).toHaveBeenCalledWith('test-slug');
      expect(screen.getByText('(9)')).toBeInTheDocument();
      expect(screen.getByText(/Favorite Article/i)).toBeInTheDocument();
    });
  });

  describe('FollowButton', () => {
    it('redirects to /register if unauthenticated user clicks follow', async () => {
      const user = { username: 'charlie', following: false };

      render(
        <AuthContext.Provider value={{ isAuthenticated: false }}>
          <MemoryRouter initialEntries={['/@charlie']}>
            <Routes>
              <Route path="/@charlie" element={<FollowButton user={user} />} />
              <Route path="/register" element={<div data-testid="register-page">Register Page</div>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );

      act(() => {
        screen.getByRole('button').click();
      });

      expect(screen.getByTestId('register-page')).toBeInTheDocument();
      expect(agent.Profile.follow).not.toHaveBeenCalled();
    });

    it('toggles follow and unfollow states when authenticated', async () => {
      const user = { username: 'charlie', following: false };
      agent.Profile.follow.mockResolvedValue({});

      render(
        <AuthContext.Provider value={{ isAuthenticated: true }}>
          <MemoryRouter>
            <FollowButton user={user} />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      expect(screen.getByText(/Follow charlie/i)).toBeInTheDocument();

      await act(async () => {
        screen.getByRole('button').click();
      });

      expect(agent.Profile.follow).toHaveBeenCalledWith('charlie');
      expect(screen.getByText(/Unfollow charlie/i)).toBeInTheDocument();
    });
  });
});
