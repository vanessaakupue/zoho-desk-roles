
import { useState } from 'react';

export default function DeleteRoleForm({ onClose, onRoleDeleted, roles, roleId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    transferToRoleId: ''
  });

  const handleDelete = async (e) => {
    e.preventDefault();

    const payload = {
      transferToRoleId: formData.transferToRoleId
    };
  
    if (formData.transferToRoleId) {
      payload.transferToRoleId = String(formData.transferToRoleId);
    }

    if (!formData.transferToRoleId) {
      alert('Please select a role to transfer data.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/roles/${roleId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = response;

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete role');
      }

      onRoleDeleted();
      setFormData({
        transferToRoleId: '',
      });
      onClose();
      alert('Role deleted successfully!');
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Error deleting role.');
    }finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      transferToRoleId: value ? String(value) : ''
    }));  
  };

  return(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h2 className="text-xl mb-4">Delete Role</h2>
      <p className="mb-4">Please select a role to transfer data to:</p>

      <select
        value={formData.transferToRoleId}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      >
        <option value="">Select a role</option>
        {roles.filter((role) => role.shareDataWithPeers === true && role.id !== roleId).map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete Role
        </button>
      </div>
    </div>
  </div>
  );
}