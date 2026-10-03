import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Article from '../features/Article/Article';
import { AuthContext } from '../context/AuthContext';
import agent from '../api/agent';

vi.mock('../api/agent', () => ({
  default: {
    Articles: {
      get: vi.fn(),
      del: vi.fn(),
    },
    Comments: {
      forArticle: vi.fn(),
      create: vi.fn(),
      del: vi.fn(),
    },
    Profile: {
      follow: vi.fn(),
      unfollow: vi.fn(),
    },
  },
}));

const mockArticle = {
  slug: 'test-article-slug',
  title: 'Test Title Here',
  description: 'Test Description',
  body: '### Markdown Body Header\n\nSome paragraph content.',
  tagList: ['tag1', 'tag2'],
  createdAt: '2026-10-01T12:00:00.000Z',
  favorited: false,
  favoritesCount: 5,
  author: {
    username: 'author-alice',
    image: 'https://example.com/alice.jpg',
    following: false,
  },
};

const mockComments = [
  {
    id: 1,
    body: 'Comment by Alice',
    createdAt: '2026-10-02T12:00:00.000Z',
    author: { username: 'author-alice', image: 'https://example.com/alice.jpg' },
  },
  {
    id: 2,
    body: 'Comment by Bob',
    createdAt: '2026-10-02T13:00:00.000Z',
    author: { username: 'bob', image: 'https://example.com/bob.jpg' },
  },
];

const renderArticlePage = (authContextValue) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <MemoryRouter initialEntries={['/article/test-article-slug']}>
        <Routes>
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Article View Permissions & Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    agent.Articles.get.mockResolvedValue({ article: mockArticle });
    agent.Comments.forArticle.mockResolvedValue({ comments: mockComments });
  });

  it('renders author controls (Edit & Delete) when viewer is the article author', async () => {
    const currentUser = { username: 'author-alice' };
    renderArticlePage({ currentUser, isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Test Title Here')).toBeInTheDocument();
    });

    // Author should see Edit Article and Delete Article buttons
    expect(screen.getAllByText(/Edit Article/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Delete Article/i).length).toBeGreaterThan(0);

    // Author should NOT see Follow self
    expect(screen.queryByText(/Follow author-alice/i)).not.toBeInTheDocument();
  });

  it('renders Follow & Favorite buttons when viewer is not the article author', async () => {
    const currentUser = { username: 'bob' };
    renderArticlePage({ currentUser, isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Test Title Here')).toBeInTheDocument();
    });

    // Non-author should see Follow & Favorite buttons
    expect(screen.getAllByText(/Follow author-alice/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Favorite Article/i).length).toBeGreaterThan(0);

    // Non-author should NOT see Edit Article or Delete Article
    expect(screen.queryByText(/Edit Article/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Delete Article/i)).not.toBeInTheDocument();
  });

  it('displays delete comment button only on comments created by current user', async () => {
    const currentUser = { username: 'bob' };
    renderArticlePage({ currentUser, isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Comment by Alice')).toBeInTheDocument();
      expect(screen.getByText('Comment by Bob')).toBeInTheDocument();
    });

    // Bob can only delete Bob's comment (1 trash icon), not Alice's comment
    const trashIcons = document.querySelectorAll('.mod-options .ion-trash-a');
    expect(trashIcons.length).toBe(1);
  });
});
