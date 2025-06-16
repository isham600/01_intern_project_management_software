import React, { useRef, useState, useEffect } from "react";
import {
  BoldOutlined, ItalicOutlined, UnderlineOutlined, LinkOutlined,
  UndoOutlined, RedoOutlined, PictureOutlined, SaveOutlined,
  PaperClipOutlined, OrderedListOutlined, UnorderedListOutlined,
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  MenuOutlined, DeleteOutlined
} from "@ant-design/icons";
import { Button, Dropdown, Menu, Upload, Tag, message, Tooltip } from "antd";
import axios from "axios";

const TextEntryEditor = () => {
  const editorRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/text-entries");
      setEntries(res.data || []);
    } catch (err) {
      message.error("Failed to load entries");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const execCommand = (command, value = null) => {
    if (command === "createLink" && !value) return;
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSave = async () => {
    const content = editorRef.current.innerHTML;

    const formData = new FormData();
    formData.append("message", content);

    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await fetch("http://localhost:3000/api/text-entries", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Saved successfully!");
        fetchEntries();
        editorRef.current.innerHTML = "";
        setFileList([]);
      } else {
        message.error("Failed to save.");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("API error:", error);
      message.error("Something went wrong.");
    }
  };

  const handleCancel = () => {
    editorRef.current.innerHTML = "";
    setFileList([]);
  };

  const onUploadChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 5) {
      message.error("You can upload up to 5 files only.");
      return;
    }
    setFileList(newFileList);
  };

  const removeFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/text-entries/${id}`);
      message.success("Entry deleted");
      fetchEntries();
    } catch (err) {
      message.error("Failed to delete entry");
    }
  };

  const paragraphMenu = (
    <Menu
      onClick={({ key }) => execCommand("formatBlock", key)}
      items={[
        { label: "Paragraph", key: "P" },
        { label: "Heading 1", key: "H1" },
        { label: "Heading 2", key: "H2" },
      ]}
    />
  );

  return (
    <div className="border rounded shadow bg-white max-w-4xl mt-1 mx-4">
      {/* Toolbar */}
      <div className="flex items-center px-2 py-1 border-b gap-1 flex-wrap">
        <Dropdown menu={paragraphMenu} trigger={["click"]}>
          <Button size="small" className="!rounded-none text-xs">Paragraph</Button>
        </Dropdown>

        <Button icon={<BoldOutlined />} size="small" onClick={() => execCommand("bold")} />
        <Button icon={<ItalicOutlined />} size="small" onClick={() => execCommand("italic")} />
        <Button icon={<UnderlineOutlined />} size="small" onClick={() => execCommand("underline")} />
        <Button icon={<LinkOutlined />} size="small" onClick={() => {
          const url = prompt("Enter URL");
          if (url) execCommand("createLink", url);
        }} />
        <Upload
          fileList={fileList}
          beforeUpload={() => false}
          onChange={onUploadChange}
          multiple
          showUploadList={false}
        >
          <Button icon={<PictureOutlined />} size="small" />
        </Upload>
        <Button icon={<UndoOutlined />} size="small" onClick={() => execCommand("undo")} />
        <Button icon={<RedoOutlined />} size="small" onClick={() => execCommand("redo")} />
        <Button icon={<UnorderedListOutlined />} size="small" onClick={() => execCommand("insertUnorderedList")} />
        <Button icon={<OrderedListOutlined />} size="small" onClick={() => execCommand("insertOrderedList")} />
        <Button icon={<AlignLeftOutlined />} size="small" onClick={() => execCommand("justifyLeft")} />
        <Button icon={<AlignCenterOutlined />} size="small" onClick={() => execCommand("justifyCenter")} />
        <Button icon={<AlignRightOutlined />} size="small" onClick={() => execCommand("justifyRight")} />
        <Button icon={<MenuOutlined />} size="small" onClick={() => execCommand("justifyFull")} />
      </div>

      {/* Editor */}
      <div>
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[120px] px-3 py-2 text-sm focus:outline-none"
          suppressContentEditableWarning
        ></div>

        <div className="flex justify-end gap-2 px-3 py-2 bg-gray-50">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button icon={<SaveOutlined />} onClick={handleSave} style={{ background: "#BBF7D0", border: "none" }} className="text-green-900">
            Save
          </Button>
        </div>
      </div>

      {/* File Previews */}
      <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-50">
        {fileList.map((file) => (
          <Tag
            key={file.uid}
            closable
            onClose={() => removeFile(file)}
            icon={<PaperClipOutlined />}
            className="max-w-[200px] truncate"
          >
            {file.name}
          </Tag>
        ))}
      </div>

      {/* Entries Preview Section */}
      <div className="mt-6 px-4 py-2 bg-white border-t rounded">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Submitted Text Entries</h3>

        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">No entries yet.</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry._id} className="relative border border-gray-200 p-3 rounded bg-gray-50">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteEntry(entry._id)}
                  type="text"
                  size="small"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                />
                <div
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: entry.message }}
                />
                {entry.attachments?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={`http://localhost:3000/${file.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        📎 {file.originalName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEntryEditor;


// import React, { useRef, useState } from "react";
// import {
//   BoldOutlined,
//   ItalicOutlined,
//   UnderlineOutlined,
//   LinkOutlined,
//   UndoOutlined,
//   RedoOutlined,
//   PictureOutlined,
//   TableOutlined,
//   SaveOutlined,
//   PaperClipOutlined,
//   OrderedListOutlined,
//   UnorderedListOutlined,
//   AlignLeftOutlined,
//   AlignCenterOutlined,
//   AlignRightOutlined,
//   MenuOutlined,
// } from "@ant-design/icons";
// import { Button, Dropdown, Menu, Upload, Tag, message, Tooltip } from "antd";

// const RichTextEditor = () => {
//   const editorRef = useRef(null);
//   const [fileList, setFileList] = useState([]);

//   const execCommand = (command, value = null) => {
//     if (command === "createLink" && !value) return;
//     document.execCommand(command, false, value);
//     editorRef.current.focus();
//   };

//   const paragraphMenu = (
//     <Menu
//       onClick={({ key }) => execCommand("formatBlock", key)}
//       items={[
//         { label: "Paragraph", key: "P" },
//         { label: "Heading 1", key: "H1" },
//         { label: "Heading 2", key: "H2" },
//       ]}
//     />
//   );

//   const handleSave = () => {
//     alert(
//       "Content: " +
//         editorRef.current.innerHTML +
//         "\n\nAttachments: " +
//         fileList.map((f) => f.name).join(", ")
//     );
//   };

//   const handleCancel = () => {
//     editorRef.current.innerHTML = "";
//     setFileList([]);
//   };

//   const onUploadChange = ({ fileList: newFileList }) => {
//     if (newFileList.length > 5) {
//       message.error("You can upload up to 5 files only.");
//       return;
//     }
//     setFileList(newFileList);
//   };

//   const removeFile = (file) => {
//     setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
//   };

//   return (
//     <div className="border rounded shadow bg-white max-w-4xl mt-1">
//       {/* Toolbar */}
//       <div className="flex items-center px-2 py-1 border-b gap-1 flex-wrap">
//         <Dropdown overlay={paragraphMenu} trigger={["click"]}>
//           <Button size="small" className="!rounded-none text-xs">
//             Paragraph
//           </Button>
//         </Dropdown>

//         <Button icon={<BoldOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("bold")} title="Bold" />
//         <Button icon={<ItalicOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("italic")} title="Italic" />
//         <Button icon={<UnderlineOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("underline")} title="Underline" />
//         <Button
//           icon={<LinkOutlined />}
//           size="small"
//           className="!rounded-none"
//           onClick={() => {
//             const url = prompt("Enter URL");
//             if (url) execCommand("createLink", url);
//           }}
//           title="Insert Link"
//         />
//         <Tooltip title="Attach files">
//           <Upload
//             fileList={fileList}
//             beforeUpload={() => false}
//             onChange={onUploadChange}
//             multiple
//             showUploadList={false}
//           >
//             <Button icon={<PictureOutlined />} size="small" className="!rounded-none" />
//           </Upload>
//         </Tooltip>
//         <Button icon={<UndoOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("undo")} title="Undo" />
//         <Button icon={<RedoOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("redo")} title="Redo" />
//         <Button icon={<UnorderedListOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("insertUnorderedList")} title="Bullet List" />
//         <Button icon={<OrderedListOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("insertOrderedList")} title="Numbered List" />
//         <Button icon={<AlignLeftOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyLeft")} title="Align Left" />
//         <Button icon={<AlignCenterOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyCenter")} title="Align Center" />
//         <Button icon={<AlignRightOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyRight")} title="Align Right" />
//         <Button icon={<MenuOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyFull")} title="Justify" />
//         <div className="ml-auto text-xs text-gray-500 px-2">Markdown</div>
//       </div>

//       {/* Editor & action buttons grouped */}
//       <div >
//         <div
//           ref={editorRef}
//           contentEditable
//           className="min-h-[120px] px-3 py-2 text-sm focus:outline-none"
//           suppressContentEditableWarning
//         ></div>

//         {/* Buttons inside editor box */}
//         <div className="flex justify-end gap-2 px-3 py-2 bg-gray-50">
//           <Button onClick={handleCancel} className="rounded">
//             Cancel
//           </Button>
//           <Button
//             icon={<SaveOutlined />}
//             onClick={handleSave}
//             style={{ background: "#BBF7D0", border: "none" }}
//             className="text-green-900 hover:bg-green-300 rounded"
//           >
//             Save
//           </Button>
//         </div>
//       </div>

//       {/* Attached files list */}
//       <div className="flex flex-wrap gap-2 px-3 py-2  bg-gray-50">
//         {fileList.map((file) => (
//           <Tag
//             key={file.uid}
//             closable
//             onClose={() => removeFile(file)}
//             icon={<PaperClipOutlined />}
//             className="flex items-center max-w-[200px] truncate"
//           >
//             {file.name}
//           </Tag>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RichTextEditor;
