import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignForm from './pages/CampaignForm';
import CampaignDetails from './pages/CampaignDetails';
import Post from './pages/Post';
import UserProfile from './pages/UserProfile';
import Nav from './components/Nav';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
               <>
      <div className='mx-5'>
        <Nav />
        <Home />
      </div>
      </>
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <div className='mx-5'>
        <Nav />
        <Campaigns />
      </div>
              </ProtectedRoute>
            } />
            <Route path="/campaigns/new" element={
              <ProtectedRoute>
        <CampaignForm />
              </ProtectedRoute>
            } />
            
            <Route path="/campaigns/:campaignId" element={
              <ProtectedRoute>
                      <div className='mx-5'>
        <Nav />
        <CampaignDetails />
      </div>
              </ProtectedRoute>
            } />
            <Route path="/post" element={
              <ProtectedRoute>
                <Post />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
