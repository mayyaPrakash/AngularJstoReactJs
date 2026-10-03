import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PageBar from './components/PageBar';
import Home from './pages/Home';
import Premieres from './pages/Premieres';
import Popular from './pages/Popular';
import Search from './pages/Search';
import ShowView from './pages/ShowView';

function App() {
  return (
    <>
      <Header />
      <PageBar />
      <section id="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/premieres" element={<Premieres />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/view/:id" element={<ShowView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </section>
    </>
  );
}

export default App;
