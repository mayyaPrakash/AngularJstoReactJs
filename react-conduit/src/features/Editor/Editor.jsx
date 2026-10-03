import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import agent from '../../api/agent';
import ListErrors from '../../components/ListErrors';

const Editor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagList, setTagList] = useState([]);
  const [tagField, setTagField] = useState('');
  const [errors, setErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing article for editing
  useEffect(() => {
    if (!slug) return;
    agent.Articles.get(slug)
      .then((data) => {
        const a = data.article;
        // Only the author can edit
        if (currentUser && currentUser.username !== a.author.username) {
          navigate('/');
          return;
        }
        setTitle(a.title);
        setDescription(a.description);
        setBody(a.body);
        setTagList(a.tagList || []);
      })
      .catch(() => navigate('/'));
  }, [slug, navigate, currentUser]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagField && !tagList.includes(tagField)) {
        setTagList((prev) => [...prev, tagField]);
        setTagField('');
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setTagList((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);
    const article = { title, description, body, tagList };
    try {
      let result;
      if (slug) {
        result = await agent.Articles.update({ ...article, slug });
      } else {
        result = await agent.Articles.create(article);
      }
      navigate(`/article/${result.article.slug}`);
    } catch (err) {
      setIsSubmitting(false);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={errors} />

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tags"
                    value={tagField}
                    onChange={(e) => setTagField(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <div className="tag-list">
                    {tagList.map((tag) => (
                      <span className="tag-default tag-pill" key={tag}>
                        <i
                          className="ion-close-round"
                          onClick={() => handleRemoveTag(tag)}
                        ></i>
                        {' '}{tag}
                      </span>
                    ))}
                  </div>
                </fieldset>

                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
