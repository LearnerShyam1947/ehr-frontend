import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';


// Pages
// import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Apply from './pages/auth/Apply';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Components
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './components/ProcetedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import NoAccess from './pages/auth/NoAccess';
import SetPassword from './pages/auth/SetPassword';
import TwoFactorSetup from './pages/auth/TwoFactorSetup';
import TwoFactorVerify from './pages/auth/TwoFactorVerify';
import ApplyAppointment from './pages/users/ApplyAppointment';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/about" element={<About />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/set-password/:token" element={<SetPassword />} />
                <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
                <Route path="/two-factor-verify" element={<TwoFactorVerify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/no-access" element={<NoAccess />} />
                <Route path="*" element={<NotFound />} />

                
                <Route path="/appointment" element={
                  <ProtectedRoute allowedRoles={["PATIENT"]}>
                    <ApplyAppointment />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
