import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { id } = useParams();  // Extract 'id' from the URL parameters
  const navigate = useNavigate();

  // Fetch task details when the component mounts
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in first.');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/tasks/id/${id}`, // Use 'id' from URL
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (err) {
        setError('Error fetching task details.');
      }
    };

    fetchTaskDetails();
  }, [id]); // Dependency array should be 'id', not 'taskId'

  // Handle form submission to update the task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    setSuccess(false);  // Reset success state

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in first.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/id/${id}`,  // Update task with 'id' from URL
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true);
      setTimeout(() => navigate('/tasks'), 2000);  // Navigate back to the task list
    } catch (err) {
      setError('Error updating task.');
    }
  };

  return (
    <div>
      <h2>Update Task</h2>

      {success && <p style={{ color: 'green' }}>✅ Task updated successfully!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
          <button type="submit">Update Task</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTask;
