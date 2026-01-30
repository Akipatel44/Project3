import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Edit, Trash2, Search, X } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import { usersAPI, getErrorMessage } from '@/services/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await usersAPI.getAll()
      setUsers(response.data || [])
      setFilteredUsers(response.data || [])
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      console.error('Error fetching users:', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await usersAPI.delete(id)
      setUsers(users.filter(u => u.id !== id))
      setFilteredUsers(filteredUsers.filter(u => u.id !== id))
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage system users and their roles</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add User
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-600/50 text-red-300 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full mx-auto"
            />
            <p className="text-gray-400 mt-4">Loading users...</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredUsers.length > 0 && (
          <motion.div
            className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <table className="w-full">
              <thead className="bg-gray-700/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    variants={itemVariants}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{user.name || user.username}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-red-900/30 text-red-300'
                            : user.role === 'SUB_ADMIN'
                            ? 'bg-amber-900/30 text-amber-300'
                            : 'bg-blue-900/30 text-blue-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-300">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            <p>No users found</p>
          </motion.div>
        )}

        {/* Count */}
        {!loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </motion.p>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
