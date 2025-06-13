// TaskInputPanelWithAPI.tsx
import React, { useState, useEffect } from "react";
import { Input, Button, Select, Avatar, message } from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const TaskInputPanel = () => {
  const [showInput, setShowInput] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("New");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data.data || []);
    } catch (err) {
      message.error("Failed to load tasks.");
    }
  };

  const handleSave = async () => {
    if (!taskName.trim()) return;
    try {
      const res = await axios.post("/api/tasks", {
        name: taskName.trim(),
        status,
      });
      setTasks([...tasks, res.data.data]);
      setTaskName("");
      setStatus("New");
      setShowInput(false);
      message.success("Task created.");
    } catch (err) {
      message.error("Failed to create task.");
    }
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, {
        name: editingName.trim(),
      });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, name: res.data.data.name } : task
        )
      );
      setEditingId(null);
      setEditingName("");
      message.success("Task updated.");
    } catch (err) {
      message.error("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
      message.success("Task deleted.");
    } catch (err) {
      message.error("Failed to delete task.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${id}/status`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      message.error("Failed to update status.");
    }
  };

  return (
    <div className="bg-[#f1f5f9] p-3 rounded-md shadow-sm relative max-w-4xl">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-800">Tasks</span>
        {!showInput && (
          <Button
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            onClick={() => setShowInput(true)}
            className="bg-[#bbf7d0] text-teal-700 border-none hover:!text-white hover:!bg-[#4ade80]"
          />
        )}
      </div>

      {showInput && (
        <div className="mt-2 flex items-center gap-2 bg-[#d1fae5] px-2 py-2 rounded-md">
          <Input
            size="small"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task"
            className="bg-white flex-1 min-w-[60px]"
          />
          {taskName.trim() && (
            <Button
              icon={<SaveOutlined />}
              size="small"
              onClick={handleSave}
              className="bg-[#bbf7d0] text-teal-700 border-none hover:!text-white hover:!bg-[#4ade80]"
            />
          )}
          <Select
            size="small"
            value={status}
            onChange={setStatus}
            className="w-36"
            dropdownMatchSelectWidth={false}
          >
            <Option value="New">New</Option>
            <Option value="In Progress">In progress</Option>
            <Option value="Ready for Test">Ready for test</Option>
          </Select>
        </div>
      )}

      {tasks.map((task) => (
        <div
          key={task.id}
          className="group mt-2 flex items-center justify-between bg-[#d1e7e5] px-3 py-2 rounded-md"
        >
          <div className="flex items-center gap-3 w-full">
            <span className="cursor-move text-gray-500">::</span>
            {editingId === task.id ? (
              <Input
                size="small"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full max-w-[200px]"
              />
            ) : (
              <span
                className="text-sm text-blue-800 font-medium cursor-pointer"
                onClick={() => navigate("/tasks", { state: { id: task.id, name: task.name } })}
              >
                #{task.id} {task.name}
              </span>
            )}

            <div className="hidden group-hover:flex gap-2 items-center">
              {editingId === task.id ? (
                <SaveOutlined
                  className="text-gray-500 cursor-pointer"
                  onClick={() => handleEditSave(task.id)}
                />
              ) : (
                <EditOutlined
                  className="text-gray-500 cursor-pointer"
                  onClick={() => {
                    setEditingId(task.id);
                    setEditingName(task.name);
                  }}
                />
              )}
              <DeleteOutlined
                className="text-gray-500 cursor-pointer"
                onClick={() => handleDelete(task.id)}
              />
            </div>

            <Select
              size="small"
              value={task.status}
              className="w-32"
              onChange={(val) => updateStatus(task.id, val)}
            >
              <Option value="New">New</Option>
              <Option value="In Progress">In progress</Option>
              <Option value="Ready for Test">Ready for test</Option>
            </Select>

            <div className="flex items-center gap-1 ml-auto">
              <Avatar size="small" icon={<UserOutlined />} className="bg-white border" />
              <span className="text-sm text-gray-700">Not assig...</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskInputPanel;


// import React, { useState } from "react";
// import { Input, Button, Select, Avatar } from "antd";
// import {
//   PlusOutlined,
//   SaveOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom"; // <-- Added for navigation

// const { Option } = Select;

// const TaskInputPanel = () => {
//   const [showInput, setShowInput] = useState(false);
//   const [taskName, setTaskName] = useState("");
//   const [status, setStatus] = useState("New");
//   const [tasks, setTasks] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editingName, setEditingName] = useState("");

//   const navigate = useNavigate(); // <-- Init router navigation

//   const handleSave = () => {
//     if (!taskName.trim()) return;
//     const newTask = {
//       id: tasks.length + 1,
//       name: taskName.trim(),
//       status,
//       assignee: null,
//     };
//     setTasks([...tasks, newTask]);
//     setTaskName("");
//     setStatus("New");
//     setShowInput(false);
//   };

//   const handleEditSave = (id) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task.id === id ? { ...task, name: editingName.trim() } : task
//       )
//     );
//     setEditingId(null);
//     setEditingName("");
//   };

//   const handleDelete = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   return (
//     <div className="bg-[#f1f5f9] p-3 rounded-md shadow-sm relative max-w-4xl">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <span className="text-sm font-semibold text-gray-800">Tasks</span>
//         {!showInput && (
//           <Button
//             icon={<PlusOutlined />}
//             shape="circle"
//             size="small"
//             onClick={() => setShowInput(true)}
//             className="bg-[#bbf7d0] text-teal-700 border-none hover:!text-white hover:!bg-[#4ade80]"
//           />
//         )}
//       </div>

//       {/* Input Row */}
//       {showInput && (
//         <div className="mt-2 flex items-center gap-2 bg-[#d1fae5] px-2 py-2 rounded-md">
//           <Input
//             size="small"
//             value={taskName}
//             onChange={(e) => setTaskName(e.target.value)}
//             placeholder="Enter task"
//             className="bg-white flex-1 min-w-[60px]"
//           />
//           {taskName.trim() && (
//             <Button
//               icon={<SaveOutlined />}
//               size="small"
//               onClick={handleSave}
//               className="bg-[#bbf7d0] text-teal-700 border-none hover:!text-white hover:!bg-[#4ade80]"
//             />
//           )}
//           <Select
//             size="small"
//             value={status}
//             onChange={setStatus}
//             className="w-36"
//             dropdownMatchSelectWidth={false}
//           >
//             <Option value="New">New</Option>
//             <Option value="In Progress">In progress</Option>
//             <Option value="Ready for Test">Ready for test</Option>
//           </Select>
//         </div>
//       )}

//       {/* Task Rows */}
//       {tasks.map((task) => (
//         <div
//           key={task.id}
//           className="group mt-2 flex items-center justify-between bg-[#d1e7e5] px-3 py-2 rounded-md"
//         >
//           <div className="flex items-center gap-3 w-full">
//             <span className="cursor-move text-gray-500">::</span>

//             {/* Task Name (clickable) */}
//             {editingId === task.id ? (
//               <Input
//                 size="small"
//                 value={editingName}
//                 onChange={(e) => setEditingName(e.target.value)}
//                 className="w-full max-w-[200px]"
//               />
//             ) : (
//               <span
//                 className="text-sm text-blue-800 font-medium cursor-pointer"
//                 onClick={() =>
//                   navigate("/tasks", {
//                     state: { id: task.id, name: task.name },
//                   })}
//               >
//                 #{task.id} {task.name}
//               </span>
//             )}

//             {/* Icons shown only on hover */}
//             <div className="hidden group-hover:flex gap-2 items-center">
//               {editingId === task.id ? (
//                 <SaveOutlined
//                   className="text-gray-500 cursor-pointer"
//                   onClick={() => handleEditSave(task.id)}
//                 />
//               ) : (
//                 <EditOutlined
//                   className="text-gray-500 cursor-pointer"
//                   onClick={() => {
//                     setEditingId(task.id);
//                     setEditingName(task.name);
//                   }}
//                 />
//               )}

//               <DeleteOutlined
//                 className="text-gray-500 cursor-pointer"
//                 onClick={() => handleDelete(task.id)}
//               />
//             </div>

//             {/* Status Dropdown */}
//             <Select
//               size="small"
//               value={task.status}
//               className="w-32"
//               onChange={(value) => {
//                 setTasks((prev) =>
//                   prev.map((t) =>
//                     t.id === task.id ? { ...t, status: value } : t
//                   )
//                 );
//               }}
//             >
//               <Option value="New">New</Option>
//               <Option value="In Progress">In progress</Option>
//               <Option value="Ready for Test">Ready for test</Option>
//             </Select>

//             {/* Avatar */}
//             <div className="flex items-center gap-1 ml-auto">
//               <Avatar
//                 size="small"
//                 icon={<UserOutlined />}
//                 className="bg-white border"
//               />
//               <span className="text-sm text-gray-700">Not assig...</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TaskInputPanel;
