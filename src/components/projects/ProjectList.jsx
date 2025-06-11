import React, { useState } from "react";

function ProjectList({ projects, selectedProjectId, onSelectProject, createProject, deleteProject, updateProject }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [editedProjectDescription, setEditedProjectDescription] = useState("");

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (newProjectName.trim() === "") return;

    try {
      await createProject(newProjectName.trim(), newProjectDescription.trim());
      setNewProjectName("");
      setNewProjectDescription("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="project-list">
      <h2>Projects</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((project) => (
          <li
            key={project._id}
            className={project._id === selectedProjectId ? "selected" : ""}
            style={{
              cursor: "pointer",
              padding: "6px 10px",
              backgroundColor:
                project._id === selectedProjectId ? "#0052cc" : "transparent",
              color: project._id === selectedProjectId ? "white" : "#0052cc",
              borderRadius: "4px",
              marginBottom: "4px",
              userSelect: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {editingProjectId === project._id ? (
              <input
                type="text"
                className="project-edit-input"
                value={editedProjectName}
                onChange={(e) => setEditedProjectName(e.target.value)}
                onBlur={() => {
                  console.log("onBlur triggered");
                  updateProject(project._id, editedProjectName, editedProjectDescription);
                  console.log("setEditingProjectId(null) called from onBlur");
                  setEditingProjectId(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    console.log("Enter key pressed");
                    updateProject(project._id, editedProjectName, editedProjectDescription);
                    console.log("setEditingProjectId(null) called from onKeyPress");
                    setEditingProjectId(null);
                  }
                }}
                style={{ flexGrow: 1, marginRight: "10px", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
              />
            ) : (
              <span onClick={() => onSelectProject(project._id)} style={{ flexGrow: 1 }}>{project.name}</span>
            )}
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent onSelectProject from firing
                  setEditingProjectId(project._id);
                  setEditedProjectName(project.name);
                  setEditedProjectDescription(project.description);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#0052cc",
                  fontSize: "0.8em"
                }}
                title="Edit Project"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent onSelectProject from firing
                  if (window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
                    deleteProject(project._id);
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc3545",
                  fontSize: "0.8em"
                }}
                title="Delete Project"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showCreateForm ? (
        <form className="create-project-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Project description (optional)"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <button type="submit">Create Project</button>
          <button 
            type="button" 
            onClick={() => setShowCreateForm(false)}
            style={{ 
              backgroundColor: "#6b778c", 
              marginTop: "8px" 
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#36b37e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginTop: "15px",
          }}
        >
          + Create Project
        </button>
      )}
    </div>
  );
}

export default ProjectList;