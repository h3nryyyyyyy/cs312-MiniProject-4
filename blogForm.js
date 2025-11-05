import React, { useState } from 'react';

function BlogForm({ onNewPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const clearForm = () => 
    {
        setTitle('');
        setContent('');
    };

  const handleSubmit = (e) => 
    {
    e.preventDefault();
    //debug
    console.log('handleSubmit working');
    if (!title.trim() || !content.trim()) return alert('Title and content required.');
        onNewPost({ title, body: content }, clearForm);
    };

    return (
    <form onSubmit={handleSubmit} className="blog-form">
      <h2>Create New Post</h2>
        <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        />
      <button type="submit">Publish Post</button>
    </form>
  );
}

export default BlogForm;
