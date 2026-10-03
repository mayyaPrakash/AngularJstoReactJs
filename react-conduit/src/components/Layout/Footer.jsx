import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <Link className="logo-font" to="/">
          conduit
        </Link>
        <span className="attribution">
          &copy; {CURRENT_YEAR}. An interactive learning project from{' '}
          <a href="https://thinkster.io">Thinkster</a>. Code licensed under MIT.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
