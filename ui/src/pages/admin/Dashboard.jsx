import { motion } from 'framer-motion'
import { Users, MapPin, Calendar, Image, TrendingUp, Eye } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'
import StatsCard from '@/components/ui/StatsCard'

const Dashboard = () => {
  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: '1,234',
      change: 12,
      trend: 'up',
      bgGradient: 'from-blue-600 to-blue-700',
    },
    {
      icon: MapPin,
      label: 'Sacred Places',
      value: '24',
      change: 5,
      trend: 'up',
      bgGradient: 'from-green-600 to-green-700',
    },
    {
      icon: Calendar,
      label: 'Upcoming Events',
      value: '12',
      change: 8,
      trend: 'up',
      bgGradient: 'from-amber-600 to-amber-700',
    },
    {
      icon: Image,
      label: 'Gallery Items',
      value: '500+',
      change: 15,
      trend: 'up',
      bgGradient: 'from-purple-600 to-purple-700',
    },
  ]

  const recentActivities = [
    { id: 1, type: 'User Registration', user: 'John Doe', time: '2 hours ago', icon: Users },
    { id: 2, type: 'Event Created', user: 'Admin', description: 'Diwali Celebration', time: '4 hours ago', icon: Calendar },
    { id: 3, type: 'Gallery Upload', user: 'Admin', description: '12 new photos added', time: '6 hours ago', icon: Image },
    { id: 4, type: 'Place Updated', user: 'Admin', description: 'Osam Hill Temple', time: '8 hours ago', icon: MapPin },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your admin overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Recent Activities */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activities</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary-400 hover:text-primary-300 text-sm font-semibold"
              >
                View All
              </motion.button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const ActivityIcon = activity.icon

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ActivityIcon size={20} className="text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{activity.type}</p>
                      <p className="text-gray-400 text-sm">{activity.user}</p>
                      {activity.description && (
                        <p className="text-gray-500 text-xs mt-1">{activity.description}</p>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">{activity.time}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>

            <div className="space-y-3">
              {[
                { label: 'Add User', icon: Users },
                { label: 'Create Event', icon: Calendar },
                { label: 'Add Place', icon: MapPin },
                { label: 'Upload Gallery', icon: Image },
              ].map((action, index) => {
                const ActionIcon = action.icon

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-primary-600 rounded-lg transition-colors text-gray-100 hover:text-white font-semibold"
                  >
                    <ActionIcon size={18} />
                    <span className="text-left">{action.label}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* System Stats */}
            <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
              <h3 className="text-sm font-semibold text-gray-300">System Health</h3>
              <div className="space-y-2">
                {[
                  { label: 'Server Status', value: 'Online', status: 'good' },
                  { label: 'Database', value: 'Connected', status: 'good' },
                  { label: 'API Health', value: 'Healthy', status: 'good' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        stat.status === 'good' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-gray-300 font-semibold">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-primary-600/20 to-primary-700/20 border border-primary-600/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <Eye className="text-primary-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-white font-semibold mb-1">Welcome to Admin Dashboard</h3>
              <p className="text-gray-300 text-sm">
                Manage all aspects of OsamVista from this centralized dashboard. Monitor user activity, 
                manage content, and keep track of system health.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
