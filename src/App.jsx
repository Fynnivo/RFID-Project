import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './features/dashboard/pages/Dashboard';
import Login from './features/auth/pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

