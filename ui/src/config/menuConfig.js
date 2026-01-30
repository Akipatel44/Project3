/**
 * Menu Configuration by Role
 * Defines which menu items are visible for each user role
 */

export const MENU_CONFIG = {
  SUPER_ADMIN: [
    { id: 'home', label: 'Home', path: '/', icon: 'Home' },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'BarChart3' },
    { id: 'users', label: 'Users', path: '/admin/users', icon: 'Users' },
    { id: 'places', label: 'Places', path: '/places', icon: 'MapPin' },
    { id: 'events', label: 'Events', path: '/events', icon: 'Calendar' },
    { id: 'gallery', label: 'Gallery', path: '/gallery', icon: 'Image' },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: 'Settings' },
  ],
  SUB_ADMIN: [
    { id: 'home', label: 'Home', path: '/', icon: 'Home' },
    { id: 'places', label: 'Places', path: '/places', icon: 'MapPin' },
    { id: 'events', label: 'Events', path: '/events', icon: 'Calendar' },
    { id: 'gallery', label: 'Gallery', path: '/gallery', icon: 'Image' },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: 'Settings' },
  ],
  USER: [
    { id: 'home', label: 'Home', path: '/', icon: 'Home' },
    { id: 'places', label: 'Places', path: '/places', icon: 'MapPin' },
    { id: 'events', label: 'Events', path: '/events', icon: 'Calendar' },
    { id: 'gallery', label: 'Gallery', path: '/gallery', icon: 'Image' },
  ],
  PUBLIC: [
    { id: 'home', label: 'Home', path: '/', icon: 'Home' },
    { id: 'places', label: 'Places', path: '/places', icon: 'MapPin' },
    { id: 'events', label: 'Events', path: '/events', icon: 'Calendar' },
    { id: 'gallery', label: 'Gallery', path: '/gallery', icon: 'Image' },
  ],
}

/**
 * Get menu items based on user role
 */
export function getMenuByRole(role) {
  if (!role) return MENU_CONFIG.PUBLIC
  return MENU_CONFIG[role] || MENU_CONFIG.PUBLIC
}
