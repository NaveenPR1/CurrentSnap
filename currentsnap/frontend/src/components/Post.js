// src/components/Post.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Post = ({ post, role, refreshPosts }) => {
  const token = localStorage.getItem('token');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const deletePost = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const likePost = async () => {
    try {
      await axios.post(`http://localhost:3000/api/posts/${post.id}/like`);
      refreshPosts();
    } catch (error) {
      alert('Failed to like post');
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/posts/${post.id}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, post.id]);

  const addComment = async () => {
    if (newComment.trim() === '') return;
    try {
      await axios.post(`http://localhost:3000/api/posts/${post.id}/comments`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  return (
    <motion.div className="post" whileHover={{ scale: 1.02 }}>
      <h3>{post.title}</h3>
      {post.image && <img src={`http://localhost:3000${post.image}`} alt="post" />}
      <p>Posted by: {post.User ? post.User.username : 'Anonymous'}</p>
      <div className="post-actions">
        <button onClick={likePost}>Like ({post.likes || 0})</button>
        {(role === 'admin' || (role === 'member' && post.userId === parseInt(localStorage.getItem('userId')))) && (
          <button onClick={deletePost}>Delete</button>
        )}
      </div>
      {/* Comments Section (only for admins and members) */}
      {(role === 'admin' || role === 'member') && (
        <div className="comments-section">
          <button onClick={() => setShowComments(!showComments)}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
          {showComments && (
            <div>
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={addComment}>Comment</button>
              </div>
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <strong>{comment.User ? comment.User.username : 'Unknown'}:</strong> {comment.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Post;
