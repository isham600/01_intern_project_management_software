import React, { useState } from 'react';
import Card from './Card';

function Column({ column, moveCard, addCard, deleteCard, editCard, todoHasCards }) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);


  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    moveCard(cardId, sourceColumnId, column.id);
  };

  const handleAddCard = () => {
    if (newTitle.trim() === '') return;
    addCard(column.id, newTitle, newDescription);
    setNewTitle('');
    setNewDescription('');
    setAdding(false);
  };

  return (
    <div className="column" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="profile-photo-circle" title="User Profile"></div>
      <h2>{column.title}</h2>
      {/* Render empty line in front of "in progress" and "done" if "to do" has cards */}
      {(todoHasCards && (column.id === 'inprogress' || column.id === 'done')) && (
        <div style={{ height: '20px', marginBottom: '10px' }}></div>
      )}
      <div className="cards-list">
        {(column.cards.length === 0 && (column.id === 'inprogress' || column.id === 'done')) ? (
          <p style={{ color: '#5e6c84', fontStyle: 'italic', padding: '10px' }}>
            No tasks in {column.title}
          </p>
        ) : (
          column.cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              deleteCard={deleteCard}
              editCard={editCard}
              index={index}
            />
          ))
        )}
      </div>
      {adding ? (
        <div className="add-card-form">
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button onClick={handleAddCard}>Add</button>
          <button onClick={() => setAdding(false)}>Cancel</button>
        </div>
      ) : (
        // Remove add task button for inprogress and done columns
        (column.id === 'inprogress' || column.id === 'done') ? null : (
          <button className="add-card-button" onClick={() => setAdding(true)}>
            + Add Task
          </button>
        )
      )}
    </div>
  );
}

export default Column;
