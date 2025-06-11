import React from 'react';

function ProjectList({ projects, selectedProjectId, onSelectProject }) {
  return (
    <div className="project-list">
      <h2>Projects</h2>
      <ul>
        {projects.map(project => (
          <li
            key={project.id}
            className={project.id === selectedProjectId ? 'selected' : ''}
            onClick={() => onSelectProject(project.id)}
            style={{
              cursor: 'pointer',
              padding: '6px 10px',
              backgroundColor: project.id === selectedProjectId ? '#0052cc' : 'transparent',
              color: project.id === selectedProjectId ? 'white' : '#0052cc',
              borderRadius: '4px',
              marginBottom: '4px',
              userSelect: 'none',
            }}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
