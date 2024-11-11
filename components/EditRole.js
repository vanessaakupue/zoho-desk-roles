
import { useState, useEffect } from 'react';

export default function EditRoleForm({ role, onClose, onRoleUpdated, roles }) {
  const [formData, setFormData] = useState({
    name: '',
    shareDataWithPeers: '',
    reportsTo: '',
    description: '',
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        shareDataWithPeers: role.shareDataWithPeers || '',
        reportsTo: role.reportsTo || '',
        description: role.description || '',
      });
    }
  }, [role]);
 
  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      shareDataWithPeers: formData.shareDataWithPeers === 'true',
      description: formData.description
    };
  
    if (formData.reportsTo) {
      payload.reportsTo = String(formData.reportsTo);
    }

    try {
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Zoho API error: ${response.status}` || 'Failed to add role');
        // throw new Error(data.message || `Zoho API error: ${response.status}`);
      }

        onRoleUpdated();
        onClose();
        alert('Role updated successfully!');
      
    } catch (error) {
      console.error('Error adding role:', error);
      alert('Error adding role.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'reportsTo') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? String(value) : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl mb-4">Add New Role</h2>
        <form onSubmit={submit}>
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name:
            </label>
            <input
              id='name'
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Role Name"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="sharedatawithpeers" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Share data with peers
            </label>
            <select
            id="sharedatawithpeers"
            type="email"
            name="shareDataWithPeers"
            value={formData.shareDataWithPeers}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            >
              <option value="">Select an option</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="mb-4">
            <label 
              htmlFor="reportsto" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reports To:
            </label>
            <select
              id="reportsto"
              name="reportsTo"
              value={formData.reportsTo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option disabled value="">Select a supervisor</option>
              {roles.filter((roleItem) => roleItem.shareDataWithPeers === true && roleItem.id !== role.id).map((roleItem) => (
                <option key={roleItem.id} value={roleItem.id}>
                  {roleItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
