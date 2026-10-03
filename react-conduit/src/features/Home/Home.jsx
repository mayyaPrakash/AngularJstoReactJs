import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import agent from '../../api/agent';
import ArticleList from '../../components/ArticleList';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState(isAuthenticated ? 'feed' : 'all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);

  useEffect(() => {
    agent.Tags.getAll()
      .then((data) => {
        setTags(data.tags);
        setTagsLoaded(true);
      })
      .catch(() => setTagsLoaded(true));
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSelectedTag(null);
  };

  const handleTagClick = (tag) => {
    setTab('tag');
    setSelectedTag(tag);
  };

  // Build query function based on active tab
  const queryFn = useCallback(
    (page) => {
      if (tab === 'feed') return agent.Articles.feed(page);
      if (tab === 'tag') return agent.Articles.byTag(selectedTag, page);
      return agent.Articles.all(page);
    },
    [tab, selectedTag]
  );

  // Key to force ArticleList re-mount on tab/tag change
  const queryKey = useMemo(() => `${tab}-${selectedTag || ''}`, [tab, selectedTag]);

  return (
    <div className="home-page">
      {!isAuthenticated && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div className="container page">
        <div className="row">
          {/* Main feed column */}
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isAuthenticated && (
                  <li className="nav-item">
                    <a
                      href=""
                      className={`nav-link${tab === 'feed' ? ' active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabChange('feed');
                      }}
                    >
                      Your Feed
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a
                    href=""
                    className={`nav-link${tab === 'all' ? ' active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabChange('all');
                    }}
                  >
                    Global Feed
                  </a>
                </li>
                {tab === 'tag' && selectedTag && (
                  <li className="nav-item">
                    <a href="" className="nav-link active" onClick={(e) => e.preventDefault()}>
                      <i className="ion-pound"></i> {selectedTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <ArticleList queryFn={queryFn} queryKey={queryKey} />
          </div>

          {/* Sidebar: Popular tags */}
          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              {!tagsLoaded && <div>Loading tags...</div>}

              {tagsLoaded && tags.length === 0 && (
                <div className="post-preview">No tags are here... yet.</div>
              )}

              {tagsLoaded && tags.length > 0 && (
                <div className="tag-list">
                  {tags.map((tag) => (
                    <a
                      href=""
                      className="tag-default tag-pill"
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagClick(tag);
                      }}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
