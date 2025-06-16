import React, { useRef, useState,useEffect } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  LinkOutlined,
  UndoOutlined,
  RedoOutlined,
  PictureOutlined,
  TableOutlined,
  SaveOutlined,
  PaperClipOutlined,
  CloseOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Menu,
  Upload,
  Tag,
  message,
  Tooltip,
  Tabs,
} from "antd";
import axios from "axios";

const { TabPane } = Tabs;

const CommentEditor2 = () => {
  const editorRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState("comment");
  const [comments, setComments] = useState([]); 

  const fetchComments = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/comments");
    setComments(res.data || []);
  } catch (err) {
    message.error("Failed to fetch comments");
  }
};

useEffect(() => {
  fetchComments(); // fetch on mount
}, []);


const handleDeleteComment = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/comments/${id}`);
    message.success("Comment deleted");
    fetchComments(); // refresh the list
  } catch (err) {
    message.error("Failed to delete comment");
  }
};


  const execCommand = (command, value = null) => {
    if (command === "createLink" && !value) return;
    document.execCommand(command, false, value);
    editorRef.current.focus();
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

  const handleSave = async () => {
    const content = editorRef.current.innerHTML;

    if (!content.trim()) {
      message.warning("Please enter some comment text.");
      return;
    }

    const formData = new FormData();
    formData.append("message", content);

    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Comment submitted!");
      editorRef.current.innerHTML = "";
      setFileList([]);
      fetchComments();
    } catch (error) {
      console.error(error);
      message.error("Failed to submit comment.");
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

  return (
    <div className="border rounded shadow bg-white max-w-4xl mt-1">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="px-3 pt-1">
        <TabPane tab="Comment" key="comment" />
        <TabPane tab="Activity" key="activity" />
      </Tabs>

      {activeTab === "comment" && (
        <>
          <div className="flex items-center px-2 border-b gap-1 flex-wrap">
            <Dropdown menu={paragraphMenu} trigger={["click"]}>
              <Button size="small" className="!rounded-none text-xs">
                Paragraph
              </Button>
            </Dropdown>
            <Button icon={<BoldOutlined />} size="small" onClick={() => execCommand("bold")} />
            <Button icon={<ItalicOutlined />} size="small" onClick={() => execCommand("italic")} />
            <Button icon={<UnderlineOutlined />} size="small" onClick={() => execCommand("underline")} />
            <Button
              icon={<LinkOutlined />}
              size="small"
              onClick={() => {
                const url = prompt("Enter URL");
                if (url) execCommand("createLink", url);
              }}
            />
            <Tooltip title="Attach files">
              <Upload
                fileList={fileList}
                beforeUpload={() => false}
                onChange={onUploadChange}
                multiple
                showUploadList={false}
              >
                <Button icon={<PictureOutlined />} size="small" />
              </Upload>
            </Tooltip>
            <Button icon={<UndoOutlined />} size="small" onClick={() => execCommand("undo")} />
            <Button icon={<RedoOutlined />} size="small" onClick={() => execCommand("redo")} />
            <Button icon={<UnorderedListOutlined />} size="small" onClick={() => execCommand("insertUnorderedList")} />
            <Button icon={<OrderedListOutlined />} size="small" onClick={() => execCommand("insertOrderedList")} />
            <Button icon={<AlignLeftOutlined />} size="small" onClick={() => execCommand("justifyLeft")} />
            <Button icon={<AlignCenterOutlined />} size="small" onClick={() => execCommand("justifyCenter")} />
            <Button icon={<AlignRightOutlined />} size="small" onClick={() => execCommand("justifyRight")} />
            <Button icon={<MenuOutlined />} size="small" onClick={() => execCommand("justifyFull")} />
          </div>

          <div>
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[100px] p-2 text-sm focus:outline-none"
              suppressContentEditableWarning
            ></div>

            <div className="flex justify-end gap-2 bg-gray-50 p-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                style={{ background: "#BBF7D0", border: "none" }}
                icon={<SaveOutlined />}
                className="text-green-900"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-3 py-2 border-x border-b bg-gray-50">
            {fileList.map((file) => (
              <Tag
                key={file.uid}
                closable
                onClose={() => removeFile(file)}
                icon={<PaperClipOutlined />}
                className="flex items-center max-w-[200px] truncate"
              >
                {file.name}
              </Tag>
            ))}
          </div>
        </>
      )}

      {activeTab === "activity" && (
        <div className="px-4 py-2 text-sm space-y-4">
          <div>
            <b className="text-purple-600">shubham singh</b>{" "}
            <span className="text-gray-500">{Date()}</span>
            <div>
              <Tag color="blue">description</Tag>{" "}
              <a href="#" className="text-blue-600 underline">
                demo
              </a>
            </div>
          </div>
          <div>
            <b className="text-purple-600">shubham singh</b>{" "}
            <span className="text-gray-500">{Date()}</span>
            <div>
              <Tag color="red">deleted attachment:</Tag>{" "}
              <span>about-4.png</span>
            </div>
          </div>
        </div>
      )}
      <div className="px-4 py-3 border-t mt-4 bg-white rounded-md shadow-sm space-y-4">
  <h3 className="text-md font-semibold text-gray-700 mb-2">All Comments</h3>
  {comments.length === 0 ? (
    <p className="text-gray-500 text-sm">No comments yet.</p>
  ) : (
    comments.map((comment) => (
     <div
  key={comment._id}
  className="relative bg-gray-50 border border-gray-200 p-3 rounded shadow-sm space-y-2"
>
  <Button
    type="text"
    size="small"
    icon={<DeleteOutlined />}
    onClick={() => handleDeleteComment(comment._id)}
    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
  />

  {/* Rich text */}
  <div
    className="prose prose-sm max-w-none text-gray-800"
    dangerouslySetInnerHTML={{ __html: comment.message }}
  />

  {/* Attachments */}
  {comment.attachments?.length > 0 && (
    <div className="flex gap-2 flex-wrap">
      {comment.attachments.map((file, idx) => (
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

    ))
  )}
</div>

    </div>
  );
};

export default CommentEditor2;


