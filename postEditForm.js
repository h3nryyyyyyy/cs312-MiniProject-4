import React, { useState } from 'react';

function PostEditForm({ post, onUpdate, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content || post.body);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...post, title, body:content });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <h2>Edit Post ID: {post.id}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default PostEditForm;
