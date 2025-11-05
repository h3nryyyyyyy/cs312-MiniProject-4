import React from 'react';

function PostList({ posts, currentUser, onDelete, onEditStart }) {
  if (!posts || posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>By: {post.author}</p>
          {post.author === currentUser && 
          (
            <div className="post-actions">
            <button onClick={() => onEditStart(post)}>Edit</button>
            <button onClick={() => onDelete(post.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;
