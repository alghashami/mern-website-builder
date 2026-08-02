import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import DashboardPage from './pages/DashboardPage';
import SitePage from './pages/SitePage';
import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/section/:id" element={<SectionPage />} />
        <Route path="/site/:projectId" element={<SitePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;