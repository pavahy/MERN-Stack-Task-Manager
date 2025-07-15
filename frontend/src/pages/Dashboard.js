import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import '../Styles/TaskStyles.css';

const Dashboard = () => {
  const [tasksCount, setTasksCount] = useState({ total: 0, completed: 0, pending: 0 });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTasksData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in first.');
        setLoading(false);
        return;
      }

      const [statsRes, completedRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/tasks?completed=true', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTasksCount(statsRes.data);
      setCompletedTasks(completedRes.data);
    } catch (err) {
      setError('Failed to fetch tasks data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Task Manager</h2>
        </div>
        <ul className="sidebar-links">
          <li><Link to="/tasks">View Tasks</Link></li>
          <li><Link to="/tasks/create">Create New Task</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Welcome to Your Dashboard</h2>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <div className="dashboard-cards">
              <div className="card"><h3>Total Tasks</h3><p>{tasksCount.total}</p></div>
              <div className="card"><h3>Completed Tasks</h3><p>{tasksCount.completed}</p></div>
              <div className="card"><h3>Pending Tasks</h3><p>{tasksCount.pending}</p></div>
            </div>

            <div className="task-list">
              <h3>Recent Completed Tasks</h3>
              {completedTasks.length === 0 ? (
                <p>No completed tasks yet.</p>
              ) : (
                <ul className="task-list">
                  {completedTasks.map((task) => (
                    <li key={task._id} className="task-item">
                      <div className="task-header">
                        <h3>{task.title}</h3>
                        <span className="task-status completed">Completed</span>
                      </div>
                      <p>{task.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
