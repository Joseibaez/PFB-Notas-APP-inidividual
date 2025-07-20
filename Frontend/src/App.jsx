import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import NoteForm from './pages/NoteForm';
import PublicNote from './pages/PublicNote';
import NotFoundPage from './pages/NotFoundPage';

import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas - requieren autenticación */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/note/new" element={
            <ProtectedRoute>
              <NoteForm />
            </ProtectedRoute>
          } />
          <Route path="/note/edit/:id" element={
            <ProtectedRoute>
              <NoteForm />
            </ProtectedRoute>
          } />
          <Route path="/note/:id" element={
            <ProtectedRoute>
              <NoteDetail />
            </ProtectedRoute>
          } />
          
          {/* Rutas públicas */}
          <Route path="/public/note/:id" element={<PublicNote />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;