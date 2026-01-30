import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react'

const EventCard = ({ event, index, onViewDetails, isPast = false }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        isPast ? 'opacity-75' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={event.image || 'https://via.placeholder.com/400x300?text=Event+Image'}
          alt={event.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            isPast ? 'grayscale group-hover:grayscale' : ''
          }`}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white ${
              isPast
                ? 'bg-gray-600'
                : 'bg-green-600'
            }`}
          >
            {isPast ? 'Past Event' : 'Upcoming'}
          </span>
        </div>

        {/* Attendance Badge */}
        {event.attendees && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1 flex items-center gap-1">
            <Users size={16} className="text-primary-600" />
            <span className="text-sm font-bold text-gray-900">{event.attendees}+</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Date and Time */}
        <div className="flex items-start gap-2 mb-3 text-gray-700 text-sm">
          <Calendar size={16} className="flex-shrink-0 mt-0.5 text-primary-600" />
          <div>
            <div>{formatDate(event.date)}</div>
            {event.time && (
              <div className="text-gray-600 flex items-center gap-1">
                <Clock size={14} />
                {formatTime(event.time)}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2 mb-4 text-gray-700 text-sm">
            <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary-600" />
            <span className="line-clamp-2">{event.location}</span>
          </div>
        )}

        {/* Category */}
        {event.category && (
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
              {event.category}
            </span>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails && onViewDetails(event)}
          disabled={isPast}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isPast
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isPast ? 'View Details' : 'Register Now'}
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default EventCard
