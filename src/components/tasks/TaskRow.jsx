import React from 'react';
import Card from './Card';

function TaskRow({ tasksByColumn, columnIds, todoTaskOrder, deleteCard, editCard }) {
  return (
    <div className="task-row" style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
      {columnIds.map((columnId) => {
        const card = tasksByColumn[columnId];
        if (card) {
          let taskNumber = null;
          if (columnId === 'todo') {
            // Number based on index in todo column
            taskNumber = todoTaskOrder.indexOf(card.id) + 1;
          } else {
            // Number based on index in todo column for same task id
            const idx = todoTaskOrder.indexOf(card.id);
            taskNumber = idx !== -1 ? idx + 1 : null;
          }
          return (
            <Card
              key={card.id}
              card={card}
              columnId={columnId}
              deleteCard={deleteCard}
              editCard={editCard}
              index={taskNumber !== null ? taskNumber - 1 : null}
              displayNumber={taskNumber}
            />
          );
        } else {
          // Empty placeholder for missing task in this column
          return (
            <div
              key={`empty-${columnId}`}
              style={{
                flex: '1',
                minHeight: '100px',
                border: '1px dashed #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            />
          );
        }
      })}
    </div>
  );
}

export default TaskRow; 