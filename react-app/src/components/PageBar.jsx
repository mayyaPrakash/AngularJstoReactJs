import { usePage } from '../context/PageContext';

function PageBar() {
  const { title, description, loading } = usePage();

  return (
    <section id="site-bar">
      <div className="container">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {loading && (
        <div className="page-loader">
          <div className="throbber"></div>
        </div>
      )}
    </section>
  );
}

export default PageBar;
