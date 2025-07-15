import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ViewTasks.css';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in first.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in first.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/tasks/id/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const toggleStatus = async (taskId, currentStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in first.');
      return;
    }

    try {
      const updatedStatus = !currentStatus;
      await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: updatedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, completed: updatedStatus } : task
        )
      );
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const formatDateTime = (dueDate, dueTime) => {
    const formattedDate = new Date(dueDate);
    const formattedTime = new Date(`1970-01-01T${dueTime}:00Z`);
    
    const dateStr = formattedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const timeStr = formattedTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return { date: dateStr, time: timeStr };
  };

  return (
    <div className="view-tasks-container">
      <h2>Your Tasks</h2>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <ul className="task-list">
        {tasks.length === 0 && !loading && <p>No tasks available.</p>}
        {tasks
          .filter((task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((task) => {
            const { date, time } = formatDateTime(task.dueDate, task.dueTime);

            return (
              <li key={task._id} className="task-item">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                {task.dueDate && (
                  <div className="due-date-time">
                    <p className="due-date">Due Date: {date}</p>
                    <p className="due-time">Due Time: {time}</p>
                  </div>
                )}
                <p>{task.description}</p>
                <div className="task-actions">
                  <Link to={`/tasks/update/${task._id}`} className="btn-edit">Update</Link>
                  <button onClick={() => deleteTask(task._id)} className="btn-delete">Delete</button>
                  <button
                    onClick={() => toggleStatus(task._id, task.completed)}
                    className="btn-toggle"
                  >
                    Mark as {task.completed ? 'Pending' : 'Completed'}
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ViewTasks;
