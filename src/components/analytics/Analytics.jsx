import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Analytics = ({ columns, projects, selectedProjectId }) => {
  const [cardData, setCardData] = useState([]);
  const [taskDistributionData, setTaskDistributionData] = useState([]);
  const [dailyProgressData, setDailyProgressData] = useState([]);

  useEffect(() => {
    if (!columns || !projects || !selectedProjectId) return;

    const todoCount = columns.todo?.cards?.length || 0;
    const inprogressCount = columns.inprogress?.cards?.length || 0;
    const inreviewCount = columns.inreview?.cards?.length || 0;
    const doneCount = columns.done?.cards?.length || 0;

    const totalTasks = todoCount + inprogressCount + inreviewCount + doneCount;
    const completedTasks = doneCount;

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;
    const remainingTasks = totalTasks - completedTasks;

    const currentCardData = [
      { title: "To Do Tasks", value: todoCount, color: "#007bff" },
      { title: "In Progress Tasks", value: inprogressCount, color: "#ffc107" },
      { title: "Completion Rate", value: `${completionRate}%`, subText: `${completedTasks} of ${totalTasks} tasks completed`, color: "#28a745" },
      { title: "Today's Progress", value: 0, subText: "tasks completed today", color: "#6c757d" },
      { title: "In Review Tasks", value: inreviewCount, color: "#6f42c1" },
      { title: "Done Tasks", value: doneCount, color: "#28a745" },
      { title: "This Week", value: 0, subText: "tasks completed this week", color: "#fd7e14" },
      { title: "Remaining Tasks", value: remainingTasks, color: "#dc3545" },
    ];
    setCardData(currentCardData);

    const currentTaskDistributionData = [
      { name: 'To Do', value: todoCount },
      { name: 'In Progress', value: inprogressCount },
      { name: 'In Review', value: inreviewCount },
      { name: 'Done', value: doneCount },
    ];
    setTaskDistributionData(currentTaskDistributionData);

    // Calculate daily progress data
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const progressMap = new Map();
    daysOfWeek.forEach(day => progressMap.set(day, { name: day, tasks: 0, completed: 0 }));

    Object.entries(columns).forEach(([columnKey, column]) => {
      column.cards.forEach(card => {
        if (card.timestamp) {
          const date = new Date(card.timestamp);
          const dayName = daysOfWeek[date.getDay()];
          
          const currentDayData = progressMap.get(dayName);
          if (currentDayData) {
            currentDayData.tasks += 1;
            // A task is 'completed' if it's in the 'done' column
            if (columnKey === 'done') {
              currentDayData.completed += 1;
            }
            progressMap.set(dayName, currentDayData);
          }
        }
      });
    });

    // Convert map to array, ensuring days are in order
    const orderedDailyProgressData = daysOfWeek.map(day => progressMap.get(day));

    setDailyProgressData(orderedDailyProgressData);

  }, [columns, projects, selectedProjectId]);

  const COLORS = ['#007bff', '#ffc107', '#6f42c1', '#28a745'];

  const selectedProject = projects.find(project => project._id === selectedProjectId);

  return (
    <div className="analytics-page" style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.2em", color: "#1a5276", textAlign: "center", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>Analytics for {selectedProject ? selectedProject.name : 'Selected Project'}</h1>
      
      <div className="analytics-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
        {cardData.map((card, index) => (
          <div key={index} style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "1.2em", color: "#555", marginBottom: "10px" }}>{card.title}</h3>
            <p style={{ fontSize: "2em", fontWeight: "bold", color: card.color }}>{card.value}</p>
            {card.subText && <p style={{ fontSize: "0.9em", color: "#777" }}>{card.subText}</p>}
          </div>
        ))}
      </div>

      <div className="analytics-charts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" }}>
        <div className="task-distribution" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "1.5em", color: "#333" }}>Task Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {taskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="daily-progress" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "1.5em", color: "#333" }}>Daily Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dailyProgressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tasks" stroke="#007bff" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="completed" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 