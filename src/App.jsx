import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectList from "./components/projects/ProjectList";
import KanbanBoard from "./components/board/KanbanBoard";
import Analytics from "./components/analytics/Analytics";

// Remove the baseURL configuration
// axios.defaults.baseURL = "http://localhost:3001/api";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("board");

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0]._id);
        await fetchProjectBoard(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectBoard = async (projectId) => {
    try {
      const response = await axios.get(`/api/board/${projectId}`);
      const boardData = response.data;
      
      setColumns({
        todo: boardData.todo,
        inprogress: boardData.inprogress,
        inreview: boardData.inreview,
        done: boardData.done,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching board:", err);
      setError("Failed to load board data");
      setLoading(false);
    }
  };

  // When user selects a project, update columns state to that project's board
  const onSelectProject = async (id) => {
    setSelectedProjectId(id);
    await fetchProjectBoard(id);
  };

  // Create a new project
  const createProject = async (name, description = "") => {
    try {
      const response = await axios.post("/api/projects", { name, description });
      const newProject = response.data;
      
      setProjects(prev => [newProject, ...prev]);
      setSelectedProjectId(newProject._id);
      await fetchProjectBoard(newProject._id);
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project");
    }
  };

  // Helper: save current columns state back to backend for the selected project
  const saveBoard = async (updatedColumns) => {
    if (!selectedProjectId) return;

    try {
      await axios.post("/api/board", {
        projectId: selectedProjectId,
        columns: updatedColumns,
      });
      setColumns(updatedColumns);
      console.log("Board saved successfully.");
    } catch (err) {
      console.error("Error saving board:", err);
      setError("Failed to save board");
    }
  };

  // Move a card from one column to another
  const moveCard = (cardId, sourceColumnId, destColumnId) => {
    if (sourceColumnId === destColumnId) return;

    const sourceCards = [...columns[sourceColumnId].cards];
    const destCards = [...columns[destColumnId].cards];

    const cardIndex = sourceCards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;
    const [card] = sourceCards.splice(cardIndex, 1);
    destCards.push(card);

    const updatedColumns = {
      ...columns,
      [sourceColumnId]: { ...columns[sourceColumnId], cards: sourceCards },
      [destColumnId]: { ...columns[destColumnId], cards: destCards },
    };

    saveBoard(updatedColumns);
  };

  // Add a new card to a column
  const addCard = (columnId, title, description) => {
    const newCard = {
      id: Date.now().toString(),
      title,
      description,
      timestamp: new Date().toISOString(),
    };

    const updatedCards = [...columns[columnId].cards, newCard];
    const updatedColumns = {
      ...columns,
      [columnId]: { ...columns[columnId], cards: updatedCards },
    };

    saveBoard(updatedColumns);
  };

  // Delete a card from a column
  const deleteCard = (columnId, cardId) => {
    const updatedCards = columns[columnId].cards.filter((c) => c.id !== cardId);
    const updatedColumns = {
      ...columns,
      [columnId]: { ...columns[columnId], cards: updatedCards },
    };

    saveBoard(updatedColumns);
  };

  // Edit a card's title and description
  const editCard = (columnId, cardId, newTitle, newDescription) => {
    const updatedCards = columns[columnId].cards.map((c) => {
      if (c.id === cardId) {
        return {
          ...c,
          title: newTitle,
          description: newDescription,
          timestamp: new Date().toISOString(),
        };
      }
      return c;
    });

    const updatedColumns = {
      ...columns,
      [columnId]: { ...columns[columnId], cards: updatedCards },
    };

    saveBoard(updatedColumns);
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      // If the deleted project was the selected one, clear selected project
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
        setColumns({}); // Clear board when no project is selected
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project");
    }
  };

  // Update a project
  const updateProject = async (projectId, newName, newDescription) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}`, { name: newName, description: newDescription });
      const updatedProject = response.data;
      setProjects(prev => prev.map(p => p._id === projectId ? updatedProject : p));
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project");
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <div className="header" style={{ padding: "20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ marginBottom: "0", fontSize: "1.8em", color: "#1a5276", textAlign: "left", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Project Management</h1>
        <nav>
          <button onClick={() => setActiveView("board")} style={{ marginRight: "10px", padding: "10px 15px", border: "none", background: activeView === "board" ? "#007bff" : "#f0f0f0", color: activeView === "board" ? "white" : "black", cursor: "pointer", borderRadius: "5px" }}>Task Board</button>
          <button onClick={() => setActiveView("analytics")} style={{ padding: "10px 15px", border: "none", background: activeView === "analytics" ? "#007bff" : "#f0f0f0", color: activeView === "analytics" ? "white" : "black", cursor: "pointer", borderRadius: "5px" }}>Analytics</button>
        </nav>
      </div>

      {activeView === "board" && projects.length === 0 && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>No projects found</h2>
          <p>Create your first project to get started!</p>
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            createProject={createProject}
            deleteProject={deleteProject}
            updateProject={updateProject}
          />
        </div>
      )}

      {activeView === "board" && projects.length > 0 && (
        <div className="board-layout-container">
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            createProject={createProject}
            deleteProject={deleteProject}
            updateProject={updateProject}
          />
          {selectedProjectId && (
            <KanbanBoard
              columns={columns}
              moveCard={moveCard}
              addCard={addCard}
              deleteCard={deleteCard}
              editCard={editCard}
            />
          )}
        </div>
      )}

      {activeView === "analytics" && (
        <Analytics 
          columns={columns}
          projects={projects}
          selectedProjectId={selectedProjectId}
        />
      )}
    </div>
  );
}

export default App; 