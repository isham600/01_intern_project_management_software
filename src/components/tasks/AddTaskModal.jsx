import React, { useState } from 'react';

const AddTaskModal = ({ onAddTask, onClose, columns }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo'); // Default to 'To Do'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(status, title, description);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '1.5em', color: '#333' }}>Add New Task</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '1em'
            }}
            required
          />
          <textarea
            placeholder="Task Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '1em',
              resize: 'vertical'
            }}
          ></textarea>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '1em',
              backgroundColor: '#f8f8f8'
            }}
          >
            {Object.keys(columns).map(colId => (
              <option key={colId} value={colId}>
                {columns[colId].title}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              background: '#f0f0f0',
              cursor: 'pointer',
              fontSize: '1em'
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1em'
            }}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal; 