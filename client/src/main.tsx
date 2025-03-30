import { createRoot } from 'react-dom/client'; // Added this import
import App from './App';
import Board from './pages/Board';
import ErrorPage from './pages/ErrorPage';
import EditTicket from './pages/EditTicket';
import CreateTicket from './pages/CreateTicket';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Assuming you have a root element with id 'root' in your index.html
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
