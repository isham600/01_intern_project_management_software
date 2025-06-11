import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const defaultColumns = {
    'todo': {
      id: 'todo',
      title: 'To Do',
      cards: [],
    },
    'inprogress': {
      id: 'inprogress',
      title: 'In Progress',
      cards: [],
    },
    'done': {
      id: 'done',
      title: 'Done',
      cards: [],
    },
  };

  const [columns, setColumns] = useState(defaultColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load board data from localStorage or backend API
  useEffect(() => {
    const localData = localStorage.getItem('kanbanBoard');
    if (localData) {
      setColumns(JSON.parse(localData));
      setLoading(false);
    } else {
      async function fetchBoard() {
        try {
          const response = await fetch('http://localhost:4000/board');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setColumns(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
      fetchBoard();
    }
  }, []);

  // Helper function to update backend and localStorage with new board data
  async function updateBoard(newColumns) {
    try {
      const response = await fetch('http://localhost:4000/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newColumns),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setColumns(newColumns);
      localStorage.setItem('kanbanBoard', JSON.stringify(newColumns));
    } catch (err) {
      setError(err.message);
    }
  }

  // Function to handle moving cards between columns
  const moveCard = (cardId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;

    const newColumns = { ...columns };
    const sourceCards = [...newColumns[sourceColumnId].cards];
    const targetCards = [...newColumns[targetColumnId].cards];
    const cardIndex = sourceCards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const [card] = sourceCards.splice(cardIndex, 1);

    // Update timestamp if moving to inprogress or done
    if (targetColumnId === 'inprogress' || targetColumnId === 'done') {
      card.timestamp = new Date().toISOString();
    }

    targetCards.push(card);

    newColumns[sourceColumnId] = {
      ...newColumns[sourceColumnId],
      cards: sourceCards,
    };
    newColumns[targetColumnId] = {
      ...newColumns[targetColumnId],
      cards: targetCards,
    };

    updateBoard(newColumns);
  };

  
  const addCard = (columnId, title, description) => {
    
    const allCards = [
      ...columns.todo.cards,
      ...columns.inprogress.cards,
      ...columns.done.cards,
    ];

    let existingCard = null;
    let existingColumnId = null;
    let existingCardIndex = -1;

    for (const colId of ['todo', 'inprogress', 'done']) {
      const cards = columns[colId].cards;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const match = card.title.match(/^Task (\d+):/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (title.includes(num.toString())) {
            existingCard = card;
            existingColumnId = colId;
            existingCardIndex = i;
            break;
          }
        }
      }
      if (existingCard) break;
    }

    if (existingCard) {
      // Update existing card's title and description
      const updatedCard = {
        ...existingCard,
        title: `Task ${existingCard.title.match(/^Task (\d+):/)[1]}: ${title}`,
        description,
      };
      const updatedCards = [...columns[existingColumnId].cards];
      updatedCards[existingCardIndex] = updatedCard;

      const newColumns = {
        ...columns,
        [existingColumnId]: {
          ...columns[existingColumnId],
          cards: updatedCards,
        },
      };

      updateBoard(newColumns);
    } else {
      // Determine the next task number based on max existing task number in all columns
      let maxTaskNumber = 0;
      allCards.forEach(card => {
        const match = card.title.match(/^Task (\d+):/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxTaskNumber) maxTaskNumber = num;
        }
      });
      const nextTaskNumber = maxTaskNumber + 1;

      const newCard = {
        id: Date.now().toString(),
        title: `Task ${nextTaskNumber}: ${title}`,
        description,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      // Add new card only to the specified column
      const newColumns = {
        ...columns,
        [columnId]: {
          ...columns[columnId],
          cards: [...columns[columnId].cards, newCard],
        },
      };

      updateBoard(newColumns);
    }
  };

  // Function to delete a card from a column
  const deleteCard = (columnId, cardId) => {
    // Remove the card from the specified column
    const filteredCards = columns[columnId].cards.filter(card => card.id !== cardId);

    // Collect all cards from all columns except the deleted one
    let allCards = [];
    for (const colId of ['todo', 'inprogress', 'done']) {
      if (colId === columnId) {
        allCards = allCards.concat(filteredCards);
      } else {
        allCards = allCards.concat(columns[colId].cards);
      }
    }

    // Renumber all cards sequentially starting from 1
    allCards = allCards.map((card, index) => {
      const titleWithoutNumber = card.title.replace(/^Task \d+:\s*/, '');
      return {
        ...card,
        title: `Task ${index + 1}: ${titleWithoutNumber}`,
      };
    });

    // Distribute renumbered cards back to their columns
    const newColumns = {
      todo: {
        ...columns.todo,
        cards: allCards.filter(card => columns.todo.cards.some(c => c.id === card.id) || (columnId === 'todo' && filteredCards.some(c => c.id === card.id))),
      },
      inprogress: {
        ...columns.inprogress,
        cards: allCards.filter(card => columns.inprogress.cards.some(c => c.id === card.id) || (columnId === 'inprogress' && filteredCards.some(c => c.id === card.id))),
      },
      done: {
        ...columns.done,
        cards: allCards.filter(card => columns.done.cards.some(c => c.id === card.id) || (columnId === 'done' && filteredCards.some(c => c.id === card.id))),
      },
    };

    updateBoard(newColumns);
  };

  // Function to edit a card's title and description
  const editCard = (columnId, cardId, newTitle, newDescription) => {
    const updatedCards = columns[columnId].cards.map(card => {
      if (card.id === cardId) {
        return { ...card, title: newTitle, description: newDescription };
      }
      return card;
    });
    const newColumns = {
      ...columns,
      [columnId]: {
        ...columns[columnId],
        cards: updatedCards,
      },
    };
    updateBoard(newColumns);
  };

  if (loading) {
    return <div>Loading board data...</div>;
  }

  if (error) {
    return <div>Error loading board data: {error}</div>;
  }

  return (
    <div className="app-container">
      <h1>Kanban Board</h1>
      <KanbanBoard
        columns={columns}
        moveCard={moveCard}
        addCard={addCard}
        deleteCard={deleteCard}
        editCard={editCard}
      />
    </div>
  );
}

export default App;
