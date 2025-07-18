// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import { motion } from 'framer-motion';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  // State for new post form
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  // Determine user role from localStorage (guest if none)
  const role = localStorage.getItem('role') || 'guest';

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/posts');
      setPosts(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching posts:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || 'Error fetching posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handler for submitting a new post (for admin & member)
  const handlePostNews = async (e) => {
    e.preventDefault();
    if (!newPostTitle) {
      alert('Title is required');
      return;
    }
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', newPostTitle);
    if (newPostImage) {
      formData.append('image', newPostImage);
    }
    try {
      await axios.post('http://localhost:3000/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewPostTitle('');
      setNewPostImage(null);
      fetchPosts();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to post news');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="home-container">
      <h2>Welcome, {role.toUpperCase()}</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}

      {/* Show the post form only for Admins and Members */}
      {(role === 'admin' || role === 'member') && (
        <form onSubmit={handlePostNews} className="post-form">
          <input
            type="text"
            placeholder="Enter post title..."
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPostImage(e.target.files[0])}
          />
          <button type="submit">Post News</button>
        </form>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <Post key={post.id} post={post} role={role} refreshPosts={fetchPosts} />
        ))}
      </div>
    </motion.div>
  );
};

export default Home;
