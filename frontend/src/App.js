import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import ViewTasks from './pages/ViewTasks';
import UpdateTask from './pages/UpdateTask';
import Profile from './pages/Profile';
import ProtectedRoute from './pages/ProtectedRoute'; // fix path if needed

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={token && token !== 'undefined' ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute>
            <TaskForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <ViewTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/update/:id"
        element={
          <ProtectedRoute>
            <UpdateTask />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
