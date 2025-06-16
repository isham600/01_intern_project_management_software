import React, { useEffect, useState } from "react";
import { Input, Tag, Button, Tooltip, message } from "antd";
import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";



const presetColors = [
  "#f5222d", "#eb2f96", "#722ed1", "#2f54eb", "#52c41a",
  "#389e0d", "#13c2c2", "#1890ff", "#faad14", "#d4b106",
  "#fa8c16", "#a8071a", "#ff4d4f", "#595959", "#8c8c8c",
  "#d9d9d9", "#bfbfbf", "#262626", "#434343", "#1f1f1f"
];

const TagManager2 = () => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [color, setColor] = useState("#d9d9d9");
  const [showColors, setShowColors] = useState(false);
  const [customColor, setCustomColor] = useState("");
  const [inputVisible, setInputVisible] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/tags/`);
       setTags(response.data || []);
    } catch (err) {
      message.error("Failed to load tags from API");
    }
  };

  const handleAdd = async () => {
   
    const label = input.trim();
    const finalColor = customColor || color;
    if (!label || tags.find(tag => tag._label === label)) return;

    try {
      const newTag = { label, color: finalColor };
      const response = await axios.post(`http://localhost:3000/api/tags/`, newTag);
      setTags([...tags, response.data.tag]); 
      setInput("");
      setCustomColor("");
      setShowColors(false);
      setInputVisible(false);
      message.success("Tag added");
    } catch (err) {
      message.error("Failed to add tag");
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tags/${id}`);
      setTags(tags.filter(tag => tag._id !== id));
      message.success("Tag removed");
    } catch (err) {
      message.error("Failed to remove tag");
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 max-w-4xl relative">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Tag
            key={tag._id}
            color={tag.color}
            closable
            onClose={() => handleRemove(tag._id)}
            closeIcon={<CloseOutlined />}
            className="text-white font-normal"
          >
            {tag.label}
          </Tag>
        ))}
      </div>

      {/* Input or Add Tag button */}
      <div className="relative flex justify-between items-start">
        <div className="flex gap-2 items-center">
          {!inputVisible && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => setInputVisible(true)}
              className="bg-[#0aaf78] text-white border-none"
            >
              Add Tag
            </Button>
          )}

          {inputVisible && (
            <>
              <Input
                placeholder="Enter tag"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleAdd}
                className="w-48"
                autoFocus
              />
              <div
                className="w-8 h-8 rounded border cursor-pointer"
                style={{ backgroundColor: customColor || color }}
                onClick={() => setShowColors(!showColors)}
              />
              {input.trim().length > 0 && (
                <Tooltip title="Add tag">
                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleAdd}
                    className="bg-gray-300 hover:bg-gray-400 border-none h-8 w-8 p-0"
                  />
                </Tooltip>
              )}
            </>
          )}
        </div>

        {/* Creator Info */}
        <div className="flex items-center text-right text-md text-[#0aaf78] ml-4 space-x-3">
          <div>
            <p>Created At </p>
              <p className="text-[#474545]">{Date()}</p>
          </div>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Color Picker Grid */}
      {showColors && inputVisible && (
        <div className="absolute z-10 mt-2 border rounded shadow bg-white p-2 grid grid-cols-10 gap-1">
          {presetColors.map((clr) => (
            <div
              key={clr}
              className={`w-6 h-6 rounded cursor-pointer border ${
                (customColor || color) === clr ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: clr }}
              onClick={() => {
                setColor(clr);
                setCustomColor("");
                setShowColors(false);
              }}
            />
          ))}
          {/* Hex Input */}
          <div className="col-span-10 mt-1 flex gap-1 items-center">
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: customColor || color }}
            />
            <Input
              placeholder="Type hex code"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManager2;