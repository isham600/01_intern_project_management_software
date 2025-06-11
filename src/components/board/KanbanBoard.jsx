import React, { useState } from "react";
import Column from "./Column";
import AddTaskModal from "../tasks/AddTaskModal";

function KanbanBoard({ columns, moveCard, addCard, deleteCard, editCard }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todoHasCards = columns.todo && columns.todo.cards.length > 0;

  // Flatten all cards with additional info for search
  const allTasks = Object.values(columns).flatMap((column) =>
    column && column.cards ? column.cards.map((card) => ({
      ...card,
      status: column.title.toLowerCase(),
      username: "User", // can customize if you have user info
    })) : []
  );

  // Filter cards based on search query
  const filterTasks = (tasks) => {
    if (!searchQuery.trim()) return tasks;
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        (task.username && task.username.toLowerCase().includes(lowerQuery))
    );
  };

  // Filter columns cards
  const filteredColumns = {};
  Object.entries(columns).forEach(([key, column]) => {
    filteredColumns[key] = {
      ...column,
      cards: column && column.cards ? filterTasks(
        column.cards.map((card) => ({
          ...card,
          username: "User",
        }))
      ) : [] ,
    };
  });

  const filteredAllTasks = filterTasks(allTasks);

  return (
    <div className="kanban-board-container">
      <div className="kanban-header">
        <input
          type="text"
          placeholder="Search tasks by name or user"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={() => setIsModalOpen(true)}>
          + Add Task
        </button>
      </div>
      <div
        className="kanban-board"
      >
        {filteredColumns.todo && (
          <Column
            key={filteredColumns.todo.id}
            column={filteredColumns.todo}
            moveCard={moveCard}
            addCard={addCard}
            deleteCard={deleteCard}
            editCard={editCard}
            todoHasCards={todoHasCards}
          />
        )}

        {filteredColumns.inprogress && (
          <Column
            key={filteredColumns.inprogress.id}
            column={filteredColumns.inprogress}
            moveCard={moveCard}
            addCard={addCard}
            deleteCard={deleteCard}
            editCard={editCard}
            todoHasCards={todoHasCards}
          />
        )}

        {console.log("filteredColumns.inreview:", filteredColumns.inreview)}
        {filteredColumns.inreview && (
          <Column
            key={filteredColumns.inreview.id}
            column={filteredColumns.inreview}
            moveCard={moveCard}
            addCard={addCard}
            deleteCard={deleteCard}
            editCard={editCard}
            todoHasCards={todoHasCards}
          />
        )}

        {filteredColumns.done && (
          <Column
            key={filteredColumns.done.id}
            column={filteredColumns.done}
            moveCard={moveCard}
            addCard={addCard}
            deleteCard={deleteCard}
            editCard={editCard}
            todoHasCards={todoHasCards}
          />
        )}

      </div>
      {isModalOpen && (
        <AddTaskModal
          onAddTask={addCard}
          onClose={() => setIsModalOpen(false)}
          columns={columns}
        />
      )}
    </div>
  );
}

export default KanbanBoard; 