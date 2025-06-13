import React, { useEffect, useState } from 'react';
import { Upload, Button, Tooltip, Modal, message, Empty } from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  BarsOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const AttachmentBar = () => {
  const [attachments, setAttachments] = useState([]);
  const [view, setView] = useState('grid');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchAttachments();
  }, []);

  const fetchAttachments = async () => {
    try {
      const res = await axios.get('/api/attachments');
      // Ensure attachments is an array from the API
      const files = res.data?.data || res.data || [];
      setAttachments(Array.isArray(files) ? files : []);
    } catch (err) {
      message.error('Failed to fetch attachments');
      setAttachments([]);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/attachments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newAttachment = res.data?.data || res.data;
      setAttachments((prev) => [...prev, newAttachment]);
      onSuccess('ok');
      message.success('Uploaded successfully');
    } catch (error) {
      onError(error);
      message.error('Upload failed');
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`/api/attachments/${id}`);
      setAttachments((prev) => prev.filter((item) => item.id !== id));
      message.success('Deleted');
    } catch (err) {
      message.error('Delete failed');
    }
  };

  return (
    <div className="w-full bg-[#f0f4f8] p-4 rounded-md shadow-sm transition-all max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700 font-semibold tracking-wide">
          {attachments.length} Attachments
        </span>
        <div className="flex items-center gap-2">
          <Tooltip title="Grid View">
            <Button
              icon={<AppstoreOutlined />}
              shape="circle"
              style={{
                backgroundColor: view === 'grid' ? '#bbf7d0' : '#f8fafc',
                borderColor: '#bbf7d0',
                color: '#047857',
              }}
              onClick={() => setView('grid')}
            />
          </Tooltip>
          <Tooltip title="List View">
            <Button
              icon={<BarsOutlined />}
              shape="circle"
              style={{
                backgroundColor: view === 'list' ? '#bbf7d0' : '#f8fafc',
                borderColor: '#bbf7d0',
                color: '#047857',
              }}
              onClick={() => setView('list')}
            />
          </Tooltip>
          <Upload
            showUploadList={false}
            customRequest={handleUpload}
            accept="image/*"
          >
            <Button
              icon={<PlusOutlined />}
              shape="circle"
              style={{
                backgroundColor: '#bbf7d0',
                borderColor: '#86efac',
                color: '#047857',
              }}
            />
          </Upload>
        </div>
      </div>

      {/* Content */}
      {attachments.length === 0 ? (
        <Empty description="No Attachments Found" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-5 gap-4">
          {attachments.map((img, idx) => (
            <div
              key={img.id}
              className="group relative flex flex-col items-center bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <img
                src={img.url}
                alt={`attachment-${idx}`}
                onClick={() => setPreview(img.url)}
                className="w-28 h-28 object-cover rounded cursor-pointer transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              <p className="text-gray-600 text-xs mt-2 text-center break-all">
                {img.name}
              </p>
              <Button
                type="text"
                icon={<DeleteOutlined className="text-red-400 hover:text-red-600" />}
                onClick={() => handleRemove(img.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {attachments.map((img) => (
            <div
              key={img.id}
              className="flex justify-between items-center bg-white px-4 py-2 rounded shadow-sm transition-all hover:shadow-md"
            >
              <span
                onClick={() => setPreview(img.url)}
                className="text-green-700 text-sm hover:underline break-all cursor-pointer"
              >
                {img.name}
              </span>
              <Button
                type="text"
                icon={<DeleteOutlined className="text-red-400 hover:text-red-600" />}
                onClick={() => handleRemove(img.id)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!preview}
        footer={null}
        onCancel={() => setPreview(null)}
        centered
      >
        <img alt="preview" src={preview} className="w-full h-auto" />
      </Modal>
    </div>
  );
};

export default AttachmentBar;


// import React, { useState } from 'react';
// import { Upload, Button, Tooltip, Modal } from 'antd';
// import {
//   PlusOutlined,
//   AppstoreOutlined,
//   BarsOutlined,
//   DeleteOutlined,
// } from '@ant-design/icons';

// const AttachmentBar = () => {
//   const [attachments, setAttachments] = useState([]);
//   const [view, setView] = useState('grid');
//   const [preview, setPreview] = useState(null);

//   const handleUpload = ({ file, onSuccess }) => {
//     setTimeout(() => {
//       onSuccess("ok");
//       setAttachments((prev) => [
//         ...prev,
//         {
//           uid: file.uid,
//           name: file.name,
//           url: URL.createObjectURL(file),
//         },
//       ]);
//     }, 0);
//   };

//   const handleRemove = (uid) => {
//     setAttachments((prev) => prev.filter((item) => item.uid !== uid));
//   };

//   return (
//     <div className="w-full bg-[#f0f4f8] p-4 rounded-md shadow-sm transition-all max-w-4xl">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <span className="text-gray-700 font-semibold tracking-wide">
//           {attachments.length} Attachments
//         </span>
//         <div className="flex items-center gap-2">
//           {/* Grid Icon */}
//           <Tooltip title="Grid View">
//             <Button
//               icon={<AppstoreOutlined />}
//               shape="circle"
//               style={{
//                 backgroundColor: view === 'grid' ? '#bbf7d0' : '#f8fafc',
//                 borderColor: '#bbf7d0',
//                 color: '#047857',
//               }}
//               onClick={() => setView('grid')}
//             />
//           </Tooltip>

//           {/* List Icon */}
//           <Tooltip title="List View">
//             <Button
//               icon={<BarsOutlined />}
//               shape="circle"
//               style={{
//                 backgroundColor: view === 'list' ? '#bbf7d0' : '#f8fafc',
//                 borderColor: '#bbf7d0',
//                 color: '#047857',
//               }}
//               onClick={() => setView('list')}
//             />
//           </Tooltip>

//           {/* Upload Button */}
//           <Upload
//             showUploadList={false}
//             customRequest={handleUpload}
//             accept="image/*"
//           >
//             <Button
//               icon={<PlusOutlined />}
//               shape="circle"
//               className="rounded-full"
//               style={{
//                 backgroundColor: '#bbf7d0',
//                 borderColor: '#86efac',
//                 color: '#047857',
//               }}
//             />
//           </Upload>
//         </div>
//       </div>

//       {/* Content */}
//       {view === 'grid' ? (
//         <div className="grid grid-cols-5 gap-4">
//           {attachments.map((img, idx) => (
//             <div
//               key={img.uid}
//               className="group relative flex flex-col items-center bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md"
//             >
//               <img
//                 src={img.url}
//                 alt={`attachment-${idx}`}
//                 onClick={() => setPreview(img.url)}
//                 className="w-28 h-28 object-cover rounded cursor-pointer transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
//               />
//               <p className="text-gray-600 text-xs mt-2 text-center break-all">
//                 {img.name}
//               </p>
//               <Button
//                 type="text"
//                 icon={<DeleteOutlined className="text-red-400 hover:text-red-600" />}
//                 onClick={() => handleRemove(img.uid)}
//                 className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col gap-2">
//           {attachments.map((img) => (
//             <div
//               key={img.uid}
//               className="flex justify-between items-center bg-white px-4 py-2 rounded shadow-sm transition-all hover:shadow-md"
//             >
//               <span
//                 onClick={() => setPreview(img.url)}
//                 className="text-green-700 text-sm hover:underline break-all cursor-pointer"
//               >
//                 {img.name}
//               </span>
//               <Button
//                 type="text"
//                 icon={<DeleteOutlined className="text-red-400 hover:text-red-600" />}
//                 onClick={() => handleRemove(img.uid)}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Preview Modal */}
//       <Modal
//         open={!!preview}
//         footer={null}
//         onCancel={() => setPreview(null)}
//         centered
//       >
//         <img alt="preview" src={preview} className="w-full h-auto" />
//       </Modal>
//     </div>
//   );
// };

// export default AttachmentBar;
