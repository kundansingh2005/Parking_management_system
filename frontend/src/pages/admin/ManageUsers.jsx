import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handeRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
        ? 'Are you sure you want to promote this user to Admin?' 
        : 'Are you sure you want to demote this Admin back to User?';
    
    if (window.confirm(confirmMsg)) {
        try {
            await axios.put(`/admin/users/${userId}/role`, { role: newRole });
            // Re-fetch users instantly to reflect new UI
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating user role');
        }
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Manage Users</h2>

      <div className="glass-panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'admin' ? 'warning' : 'neutral'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                     <button 
                         onClick={() => handeRoleChange(u.id, u.role)}
                         className={`btn ${u.role === 'admin' ? 'btn-danger' : 'btn-primary'}`} 
                         style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: 'auto' }}>
                         {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
