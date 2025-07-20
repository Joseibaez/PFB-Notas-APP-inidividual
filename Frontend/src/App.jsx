import { Routes, Route } from 'react-router-dom';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import NoteForm from './pages/NoteForm';
import PublicNote from './pages/PublicNote';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/common/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/note/new" element={<NoteForm />} />
        <Route path="/note/edit/:id" element={<NoteForm />} />
        <Route path="/note/:id" element={<NoteDetail />} />
        <Route path="/public/note/:id" element={<PublicNote />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;