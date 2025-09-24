import React from 'react';
import { Link } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/user-management" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-gray-600">Create and manage users</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
