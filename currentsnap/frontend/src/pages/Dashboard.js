// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  // State to store the complete list of members and pending members
  const [allMembers, setAllMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch all members with role 'member'
  const fetchAllMembers = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/admin/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllMembers(data);
    } catch (error) {
      console.error('Error fetching all members:', error.response?.data || error.message);
    }
  };

  // Fetch members pending approval
  const fetchPendingMembers = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/admin/members/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingMembers(data);
    } catch (error) {
      console.error('Error fetching pending members:', error.response?.data || error.message);
    }
  };

  // Approve a member by ID
  const approveMember = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/admin/members/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllMembers();
      fetchPendingMembers();
    } catch (error) {
      console.error('Error approving member:', error.response?.data || error.message);
    }
  };

  // Remove a member by ID
  const removeMember = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllMembers();
      fetchPendingMembers();
    } catch (error) {
      console.error('Error removing member:', error.response?.data || error.message);
    }
  };

  // On mount, fetch both lists
  useEffect(() => {
    fetchAllMembers();
    fetchPendingMembers();
  }, []);

  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="dashboard-container">
      <h2>Admin Dashboard</h2>
      
      {/* Pending Members Section */}
      <div className="dashboard-card">
        <h3>Pending Members</h3>
        {pendingMembers.length === 0 ? (
          <p>No pending members.</p>
        ) : (
          <ul>
            {pendingMembers.map(member => (
              <li key={member.id}>
                {member.username} - Joined: {new Date(member.created_at).toLocaleString()}
                <button onClick={() => approveMember(member.id)}>Approve</button>
                <button onClick={() => removeMember(member.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* All Members Section */}
      <div className="dashboard-card">
        <h3>All Members</h3>
        {allMembers.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Approved</th>
                <th>Joined On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allMembers.map(member => (
                <tr key={member.id}>
                  <td>{member.username}</td>
                  <td>{member.approved ? 'Yes' : 'No'}</td>
                  <td>{new Date(member.created_at).toLocaleString()}</td>
                  <td>
                    {!member.approved && (
                      <button onClick={() => approveMember(member.id)}>Approve</button>
                    )}
                    <button onClick={() => removeMember(member.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
