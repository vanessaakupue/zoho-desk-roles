import { useState, useEffect } from "react";
import RoleForm from "@/components/AddRole";
import EditRoleForm from "@/components/EditRole";
import DeleteRoleForm from "@/components/DeleteRole";

export default function Home() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch roles');
      }
      setRoles(data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDetails = async (id) => {
    try {
      const response = await fetch(`/api/roles/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch role details');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching role details:', error);
    }
  };

  const handleRoleClick = async (role) => {
    const roleDetails = await getRoleDetails(role.id)

    setSelectedRole(roleDetails)
  };

  const getRoleNameById = (id) => {
    const role = roles.find(role => role.id === id);
    return role ? role.name : 'null';
  };

  const handleEdit = (role) => {
    setEditingRole(role)
  };

  const openDeleteModal = (roleId) => {
    setRoleToDelete(roleId);
  };

  const handleRoleDeleted = () => {
    getRoles();
    setRoleToDelete(null);
  };

  if (loading) {
    return(    
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Roles Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg
            transition duration-200 ease-in-out transform hover:-translate-y-1
            shadow-md hover:shadow-lg"
          >
            Add New Role
          </button>
        </div>

        {/* roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.length > 0 ? (
            roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg 
                transition duration-200 ease-in-out p-4 border border-gray-100"
              >
                <div className="flex flex-col h-full">
                  <div onClick={() => handleRoleClick(role)} className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-all">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {role.name}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 flex-grow">
                      {role.description}
                    </p>

                    {role.reportsTo && (
                      <p className="text-gray-600 mb-4 flex-grow">
                        Reports to: {getRoleNameById(role.reportsTo)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(role)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                               hover:bg-indigo-700 transition duration-200
                               text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                       onClick={() => openDeleteModal(role.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg
                               hover:bg-red-700 transition duration-200
                               text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No roles found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Role Details Modal */}
        {selectedRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <p className="text-gray-700">NAME: {selectedRole.name}</p>
              <p className="text-gray-700">DESCRIPTION: {selectedRole.description}</p>
              <button onClick={() => setSelectedRole(null)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        )}

      {showAddModal && (
        <RoleForm 
          onClose={() => setShowAddModal(false)}
          onRoleAdded={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await getRoles();
            setShowAddModal(false)
          }} 
          roles={roles}
          />
        )}

      {editingRole && (
        <EditRoleForm
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onRoleUpdated={() => {
            getRoles();
            setEditingRole(null)
          }}
          roles={roles}
        />
      )}

      {roleToDelete && (
        <DeleteRoleForm
          roleId={roleToDelete}
          onClose={() => setRoleToDelete(null)}
          onRoleDeleted={handleRoleDeleted}
          roles={roles}
        />
      )}
    </div>
  );
}
