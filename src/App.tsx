import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import './i18n/config';
import './styles/index.css'; // Make sure this is the only CSS import
import GlobalModal from './components/GlobalModal';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppRoutes />
      <GlobalModal />
    </Router>
  );
}

export default App;