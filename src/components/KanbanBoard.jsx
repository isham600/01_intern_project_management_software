import React, { useState } from 'react';
import Column from './Column';
import TaskListColumn from './TaskListColumn';

function KanbanBoard({ columns, moveCard, addCard, deleteCard, editCard }) {
  const [searchQuery, setSearchQuery] = useState('');

  
  const todoHasCards = columns.todo && columns.todo.cards.length > 0;

  
  const allTasks = Object.values(columns).flatMap(column =>
    column.cards.map(card => ({
      ...card,
      status: column.title.toLowerCase(), 
      username: 'User', 
    }))
  );

  
  const filterTasks = (tasks) => {
    if (!searchQuery.trim()) return tasks;
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      (task.username && task.username.toLowerCase().includes(lowerQuery))
    );
  };

  
  const filteredColumns = {};
  Object.entries(columns).forEach(([key, column]) => {
    filteredColumns[key] = {
      ...column,
      cards: filterTasks(column.cards.map(card => ({
        ...card,
        username: 'User', 
      }))),
    };
  });

 
  const filteredAllTasks = filterTasks(allTasks);

  return (
    <div>
      <input
        type="text"
        placeholder="Search tasks by name or user"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: '15px',
          padding: '8px 12px',
          width: '100%',
          maxWidth: '600px',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
      <div className="kanban-board" style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
        {Object.values(filteredColumns).map(column => (
          <Column
            key={column.id}
            column={column}
            moveCard={moveCard}
            addCard={addCard}
            deleteCard={deleteCard}
            editCard={editCard}
            todoHasCards={todoHasCards}
          />
        ))}
        {/* New list column on the right side showing all tasks */}
        <TaskListColumn tasks={filteredAllTasks} />
      </div>
    </div>
  );
}

export default KanbanBoard;
