import React, { useState } from 'react';

function Card({ card, columnId, deleteCard, editCard, index, displayNumber }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const onDragStart = (e) => {
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.setData('sourceColumnId', columnId);
  };

  const handleSave = () => {
    editCard(columnId, card.id, title, description);
    setIsEditing(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="card"
      draggable={!isEditing}
      onDragStart={onDragStart}
    >
      {isEditing ? (
        <div className="card-edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}
            onClick={toggleOpen}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
          >
            <img
              src="https://www.gravatar.com/avatar/?d=mp&f=y"
              alt="Default User Profile"
              style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px' }}
            />
            <h3 style={{ margin: 0, flex: 1 }}>{displayNumber ? `Task ${displayNumber}: ${card.title}` : card.title}</h3>
          </div>
          {isOpen && (
            <>
              <p>{card.description}</p>
              {card.timestamp && (
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                  Added/Updated: {new Date(card.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              )}
              <div className="card-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={() => deleteCard(columnId, card.id)}>Delete</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Card;
