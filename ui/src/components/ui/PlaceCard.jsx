import { motion } from 'framer-motion'
import { MapPin, Calendar, Users, Star } from 'lucide-react'
import { FALLBACK_IMAGE, resolveImageUrl } from '@/utils/imageUtils'

const PlaceCard = ({ place, index, onViewDetails }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={resolveImageUrl(place.image) || FALLBACK_IMAGE}
          alt={place.name}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        {place.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {place.category}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        {place.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-gray-900">{place.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {place.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {place.description}
        </p>

        {/* Location */}
        {place.location && (
          <div className="flex items-start gap-2 mb-3 text-gray-700 text-sm">
            <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary-600" />
            <span className="line-clamp-2">{place.location}</span>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
          {place.visitingHours && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{place.visitingHours}</span>
            </div>
          )}
          {place.visitors && (
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{place.visitors} visitors</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails && onViewDetails(place)}
          className="w-full bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PlaceCard
