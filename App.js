import './App.css';
import React, { useState, useEffect } from 'react';
import PostList from './components/posts';
import BlogForm from './components/blogForm';
import PostEditForm from './components/postEditForm';
import Auth from './components/Auth';

function App() 
{
  const [posts, setPosts] = useState([]);
  const [Editing, setEditing] = useState(false);
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

  useEffect(() => {fetchPosts()}, []);
  //sign in
  const signIn = (username) => 
  {
    if (username) 
    {
      localStorage.setItem('user', username);
      setUser(username);
    }
  };
  // Handle logout
  const Logout = () => 
  {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Add new post
  const AddPost = (newPost, clearForm) => 
  {
    const post = { ...newPost, author: user };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    })
      .then(async res => 
      {
        if (!res.ok) 
        {
          const errorData = await res.json();
          console.error('Server error:', errorData);
          throw new Error('failed to create post');
        }
        return res.json();
      })

      .then(newPost => 
      {
        const newupdatedPost = 
        {
          id: newPost.id,
          title: newPost.title,
          content: newPost.content || newPost.body,
          author: newPost.author,
        };

        setPosts(prevPosts => [newupdatedPost, ...prevPosts]);
        if (clearForm) clearForm();
      })
      .catch(error => console.error('Error in post:', error));
  };

  // Delete post
  const deletePost = (id) => 
  {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(res => 
      {
        if (!res.ok) throw new Error('failed to delete');
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      })
      .catch(error => console.error('error deleting post:', error));
  };

// Update post
const updatePost = async(updatedPost) => 
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
    const newupdatedPost = 
    {
      id: updatedData.id,
      title: updatedData.title,
      content: updatedData.content || updatedData.body,
      author: updatedData.author,
    };
    setPosts((prevPosts) =>
    prevPosts.map((post) => (post.id === newupdatedPost.id ? newupdatedPost : post)));

    setEditing(false);
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
      <p>Welcome, {user}! <button onClick={Logout}>Logout</button></p>
      {Editing && currentPost ? (
      <PostEditForm
        post={currentPost}
        onUpdate={updatePost}
        onCancel={() => setEditing(false)}
    />
    ) : (
      <BlogForm onNewPost={AddPost} />)}
    <hr />
      <h2>All Posts</h2>
      <PostList
        posts={posts}
        onDelete={deletePost}
        onEdit={(post) => { setCurrentPost(post); setEditing(true); }}
        currentUser={user}
      />
    </>
    ) : (
      <Auth onSignIn={signIn} /> )}
    </div>
  );
}

export default App;
