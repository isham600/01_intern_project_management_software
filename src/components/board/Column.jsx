import React, { useState } from "react";
import Card from "../tasks/Card";

function Column({
  column,
  moveCard,
  addCard,
  deleteCard,
  editCard,
  todoHasCards,
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [visibleTaskCount, setVisibleTaskCount] = useState(5);

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");
    if (cardId && sourceColumnId) {
      moveCard(cardId, sourceColumnId, column.id);
    }
  };

  const handleAddCard = () => {
    if (newTitle.trim() === "") return;
    addCard(column.id, newTitle, newDescription);
    setNewTitle("");
    setNewDescription("");
    setAdding(false);
  };

  return (
    <div className="column" onDragOver={onDragOver} onDrop={onDrop}>
      {column.id === "todo" && <span style={{ fontSize: "1.5em", marginRight: "5px" }}>📝</span>}
      {column.id === "inprogress" && <span style={{ fontSize: "1.5em", marginRight: "5px" }}>⏳</span>}
      {column.id === "done" && <span style={{ fontSize: "1.5em", marginRight: "5px" }}>✅</span>}
      {column.id === "inreview" && <span style={{ fontSize: "1.5em", marginRight: "5px" }}>🔍</span>}
      <h2>{column.title} ({column.cards.length})</h2>
      {todoHasCards && (column.id === "inprogress" || column.id === "done") && (
        <div style={{ height: "20px", marginBottom: "10px" }}></div>
      )}
      <div className="cards-list">
        {column.cards.length === 0 ? (
          <p style={{ color: "#5e6c84", fontStyle: "italic", padding: "10px" }}>
            No tasks in {column.title}
          </p>
        ) : (
          column.cards.slice(0, visibleTaskCount).map((card, index) => (
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
      {column.cards.length > visibleTaskCount && (
        <button onClick={() => setVisibleTaskCount(prevCount => prevCount + 5)}
                style={{
                  marginTop: "10px",
                  padding: "8px 15px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "100%"
                }}>
          Load More
        </button>
      )}
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
      ) : // Remove add task button for all columns
      null
      }
    </div>
  );
}

export default Column; 