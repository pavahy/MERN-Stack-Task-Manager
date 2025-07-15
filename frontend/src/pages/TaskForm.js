import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TaskForm.css';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim() || !description.trim() || !dueDate || !dueTime) {
      setError('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Authentication required. Please log in first.');
      return;
    }

    const dueDateTime = new Date(`${dueDate}T${dueTime}`);

    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { title, description, dueDate: dueDateTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setSuccess(true);
    } catch (err) {
      setError('Error creating task. Please try again.');
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="task-form">
      <h2>Create a New Task</h2>

      {success && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'green' }}>✅ Task created successfully!</p>
          <button className="go-to-dashboard" onClick={goToDashboard}>
            Go to Dashboard
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            required
          />
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            required
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Due Time:</label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Create Task</button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;