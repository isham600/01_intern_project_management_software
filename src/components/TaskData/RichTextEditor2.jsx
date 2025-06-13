import React, { useRef, useState } from "react";
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
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu, Upload, Tag, message, Tooltip } from "antd";

const RichTextEditor2 = () => {
  const editorRef = useRef(null);
  const [fileList, setFileList] = useState([]);

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

  const handleSave = () => {
    alert(
      "Content: " +
        editorRef.current.innerHTML +
        "\n\nAttachments: " +
        fileList.map((f) => f.name).join(", ")
    );
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
      {/* Toolbar */}
      <div className="flex items-center px-2 py-1 border-b gap-1 flex-wrap">
        <Dropdown overlay={paragraphMenu} trigger={["click"]}>
          <Button size="small" className="!rounded-none text-xs">
            Paragraph
          </Button>
        </Dropdown>

        <Button icon={<BoldOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("bold")} title="Bold" />
        <Button icon={<ItalicOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("italic")} title="Italic" />
        <Button icon={<UnderlineOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("underline")} title="Underline" />
        <Button
          icon={<LinkOutlined />}
          size="small"
          className="!rounded-none"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) execCommand("createLink", url);
          }}
          title="Insert Link"
        />
        <Tooltip title="Attach files">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={onUploadChange}
            multiple
            showUploadList={false}
          >
            <Button icon={<PictureOutlined />} size="small" className="!rounded-none" />
          </Upload>
        </Tooltip>
        <Button icon={<TableOutlined />} size="small" className="!rounded-none" disabled title="Table (disabled)" />
        <Button icon={<UndoOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("undo")} title="Undo" />
        <Button icon={<RedoOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("redo")} title="Redo" />
        <Button icon={<UnorderedListOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("insertUnorderedList")} title="Bullet List" />
        <Button icon={<OrderedListOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("insertOrderedList")} title="Numbered List" />
        <Button icon={<AlignLeftOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyLeft")} title="Align Left" />
        <Button icon={<AlignCenterOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyCenter")} title="Align Center" />
        <Button icon={<AlignRightOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyRight")} title="Align Right" />
        <Button icon={<MenuOutlined />} size="small" className="!rounded-none" onClick={() => execCommand("justifyFull")} title="Justify" />
        <div className="ml-auto text-xs text-gray-500 px-2">Markdown</div>
      </div>

      {/* Editor & action buttons grouped */}
      <div >
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[120px] px-3 py-2 text-sm focus:outline-none"
          suppressContentEditableWarning
        ></div>

        {/* Buttons inside editor box */}
        <div className="flex justify-end gap-2 px-3 py-2 bg-gray-50">
          <Button onClick={handleCancel} className="rounded">
            Cancel
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{ background: "#BBF7D0", border: "none" }}
            className="text-green-900 hover:bg-green-300 rounded"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Attached files list */}
      <div className="flex flex-wrap gap-2 px-3 py-2  bg-gray-50">
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
    </div>
  );
};

export default RichTextEditor2;
