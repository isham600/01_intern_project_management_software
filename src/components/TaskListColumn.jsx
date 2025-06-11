import React from 'react';

function TaskListColumn({ tasks }) {
  return (
    <div className="task-list-column" style={{
      backgroundColor: '#ebecf0',
      borderRadius: '6px',
      padding: '15px',
      width: '200px',
      boxShadow: '0 8px 25px rgba(9,30,66,0.4)',
      maxHeight: '100vh',
      minHeight: '600px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <div className="profile-photo-circle" title="User Profile"></div>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>All Tasks</h2>
      <div className="tasks-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.length === 0 ? (
          <p style={{ fontSize: '0.9rem' }}>No tasks added</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item" style={{
              backgroundColor: '#fff',
              borderRadius: '6px',
              padding: '10px 15px',
              boxShadow: '0 2px 8px rgba(9,30,66,0.2)',
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#172b4d' }}>
                {task.title}
                <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '10px', fontStyle: 'italic' }}>
                  [{task.status}]
                </span>
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#5e6c84', whiteSpace: 'pre-wrap' }}>{task.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskListColumn;
