import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ icon: Icon, label, value, change, trend = 'up', bgGradient = 'from-primary-600 to-primary-700' }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -5 },
  }

  const isPositive = trend === 'up'

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 shadow-lg overflow-hidden relative`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
            <Icon size={24} className="text-white" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            isPositive ? 'text-green-300' : 'text-red-300'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-white/70 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
          <p className={`text-xs ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
            {isPositive ? 'Increased' : 'Decreased'} {Math.abs(change)}% from last month
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard
