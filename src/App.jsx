// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import TagDetails from './components/TagData/TagDetails';
import TaskDetails from './components/TaskData/TaskDetail'

function App() {
  return (
    <Routes>
      {/* Redirect root to /tags */}
      <Route path="/" element={<Navigate to="/tags" replace />} />
      <Route path="/tags" element={<TagDetails />} />
      <Route path="/tasks" element={<TaskDetails />} />
    </Routes>
  );
}

export default App;
