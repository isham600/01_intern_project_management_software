import React from 'react'
import { useLocation } from "react-router-dom";
import TagManager from './TagManager2'
import RichTextEditor from './RichTextEditor2'
import ImageFormCard from "./AttachmentBar2"
import CommentEditor from './CommentEditor2'
function Task() {
  const location = useLocation();
  const { id, name } = location.state || {};
  return (<>
   <div className='mx-10 mt-10'>
    {/* Header */}
    <div className="mb-2">
      <h1 className="text-3xl font-medium text-[#0aaf78]">
        #{id || "N/A"}<span className="text-[#5b665b]"> {name || "Unnamed Task"}</span>
      </h1>
      <p className="text-md pt-2 uppercase text-gray-500">User Story</p>
    </div>
    <div><TagManager /></div>
    <div><RichTextEditor /></div>
    <div><ImageFormCard /></div>
    <div><CommentEditor /></div>

    </div>
  </>)
}

export default Task