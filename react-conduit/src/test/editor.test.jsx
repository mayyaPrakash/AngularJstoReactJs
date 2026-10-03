import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Editor from '../features/Editor/Editor';
import { AuthContext } from '../context/AuthContext';
import agent from '../api/agent';

vi.mock('../api/agent', () => ({
  default: {
    Articles: {
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const renderEditor = (authContextValue, initialRoute = '/editor') => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:slug" element={<Editor />} />
          <Route path="/" element={<div data-testid="home-page">Home Redirect</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Editor Permissions and Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows author to edit their own article', async () => {
    const currentUser = { username: 'alice' };
    agent.Articles.get.mockResolvedValue({
      article: {
        slug: 'my-post',
        title: 'Alice Post',
        description: 'Post desc',
        body: 'Post body content',
        tagList: ['react', 'migration'],
        author: { username: 'alice' },
      },
    });

    renderEditor({ currentUser, isAuthenticated: true }, '/editor/my-post');

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Article Title')).toHaveValue('Alice Post');
      expect(screen.getByPlaceholderText("What's this article about?")).toHaveValue('Post desc');
      expect(screen.getByPlaceholderText('Write your article (in markdown)')).toHaveValue('Post body content');
    });

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('migration')).toBeInTheDocument();
  });

  it('redirects to home if non-author attempts to edit someone elses article', async () => {
    // Non-author: bob trying to edit alice's article
    const currentUser = { username: 'bob' };
    agent.Articles.get.mockResolvedValue({
      article: {
        slug: 'alice-secret-post',
        title: 'Alice Secret',
        description: 'Post desc',
        body: 'Post body content',
        tagList: [],
        author: { username: 'alice' },
      },
    });

    renderEditor({ currentUser, isAuthenticated: true }, '/editor/alice-secret-post');

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('allows authenticated user to create a new article', async () => {
    const currentUser = { username: 'alice' };
    renderEditor({ currentUser, isAuthenticated: true }, '/editor');

    expect(screen.getByPlaceholderText('Article Title')).toHaveValue('');
    expect(screen.getByText('Publish Article')).toBeInTheDocument();
    expect(agent.Articles.get).not.toHaveBeenCalled();
  });
});
