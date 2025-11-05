import './App.css';
import React, { useState, useEffect } from 'react';
import PostList from './components/posts';
import BlogForm from './components/blogForm';
import PostEditForm from './components/postEditForm';
import Auth from './components/Auth';

function App() 
{
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [user, setUser] = useState(localStorage.getItem('user'));

  const API_URL = 'http://localhost:3001/api/blogs';

  // get all posts
  const fetchPosts = () => 
  {
    fetch(API_URL)
    .then(res => res.json())
    .then(data => setPosts(data))
    .catch(error => console.error('Fetch error:', error));
  };

  useEffect(() => {
  fetchPosts();
  }, []);

  //sign in
  const handleSignIn = (username) => {
    if (username) {
      localStorage.setItem('user', username);
      setUser(username);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Add new post
  const handleAddPost = (newPost, clearForm) => {
    console.log('handleAddPost called', newPost);
    if (!user) 
    {
    alert('You must be signed in to post.');
    return;
    }

    const postWithAuthor = { ...newPost, author: user };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postWithAuthor),
    })
      .then(async res => 
      {
        if (!res.ok) 
        {
          const errorData = await res.json();
          console.error('Server error:', errorData);
          throw new Error('Failed to create post');
        }
        return res.json();
      })

      .then(newPostFromServer => 
      {
        const normalizedPost = 
        {
          id: newPostFromServer.id || newPostFromServer._id,
          title: newPostFromServer.title,
          content: newPostFromServer.content || newPostFromServer.body,
          author: newPostFromServer.author,
        };

        setPosts(prevPosts => [normalizedPost, ...prevPosts]);
        if (clearForm) clearForm();
      })
      .catch(error => console.error('Error creating post:', error));
  };

  // Delete post
  const handleDelete = (id) => 
  {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(res => 
      {
        if (!res.ok) throw new Error('Failed to delete post');
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      })
      .catch(error => console.error('Error deleting post:', error));
  };

// Update post
const handleUpdatePost = async(updatedPost) => 
{
  try 
  {
    const response = await fetch(`${API_URL}/${updatedPost.id}`, 
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });
    //debug
    if (!response.ok) throw new Error("Failed to update post");

    const updatedData = await response.json();
    const normalizedPost = 
    {
      id: updatedData.id,
      title: updatedData.title,
      content: updatedData.content || updatedData.body,
      author: updatedData.author,
    };
    setPosts((prevPosts) =>
    prevPosts.map((post) => (post.id === normalizedPost.id ? normalizedPost : post)));

    setIsEditing(false);
    setCurrentPost(null);
    } catch (error) {
    console.error("Error updating post:", error);
  }
};

  return (
    <div className="App">
    <h1>Blog Application</h1>

    {user ? (
    <>
      <p>Welcome, {user}! <button onClick={handleLogout}>Logout</button></p>
      {isEditing && currentPost ? (
      <PostEditForm
        post={currentPost}
        onUpdate={handleUpdatePost}
        onCancel={() => setIsEditing(false)}
    />
    ) : (
      <BlogForm onNewPost={handleAddPost} />)}
    <hr />
      <h2>All Posts</h2>
      <PostList
        posts={posts}
        onDelete={handleDelete}
        onEditStart={(post) => { setCurrentPost(post); setIsEditing(true); }}
        currentUser={user}
      />
    </>
    ) : (
      <Auth onSignIn={handleSignIn} /> )}
    </div>
  );
}

export default App;
