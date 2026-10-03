import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header id="site-header">
      <div className="container">
        <NavLink to="/" className="logo">
          REACT <span className="alt">BY</span> EXAMPLE
        </NavLink>
        <ul className="menu">
          <li><NavLink to="/" end>HOME</NavLink></li>
          <li><NavLink to="/premieres">PREMIERES</NavLink></li>
          <li><NavLink to="/popular">POPULAR</NavLink></li>
          <li><NavLink to="/search">SEARCH</NavLink></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
