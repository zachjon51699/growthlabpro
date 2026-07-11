import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import App from './App';
import ContractorOptinLandingPage from './components/ContractorOptinLandingPage';

function ContractorOptinWithNav() {
  const navigate = useNavigate();
  return <ContractorOptinLandingPage onNavigateHome={() => navigate('/')} />;
}

/**
 * The main marketing site (App) uses in-memory "pages"; it must not own /contractor-optin
 * or the URL and UI fall out of sync. This layer registers real URL routes.
 */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/contractor-optin" element={<ContractorOptinWithNav />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
