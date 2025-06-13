import React from 'react'
import TagManager from './TagManager'
import RichTextEditor from './RichTextEditor'
import ImageFormCard from "./AttachmentBar"
import TaskInputBar from './TaskInputBar'
import CommentEditor from './CommentEditor'
function Task() {
  return (<>
    <div className='mx-10 mt-10'>
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-medium text-[#0aaf78]">
          #1<span className="text-[#5b665b]"> demo</span>
        </h1>
        <p className="text-md pt-2 uppercase text-gray-500">User Story</p>
      </div>

      <div><TagManager /></div>
      <div><RichTextEditor /></div>
      <div><ImageFormCard /></div>
      <div><TaskInputBar /></div>
      <div><CommentEditor /></div>
    </div>
  </>)
}

export default Task