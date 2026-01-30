import { MainLayout } from '@/components/layout'

/**
 * Events Page
 * Display all cultural events
 */
export default function Events() {
  return (
    <MainLayout>
      <div className="container-max py-12">
        <h1 className="text-4xl font-bold mb-4">Cultural Events</h1>
        <p className="text-gray-600">Events coming soon...</p>
      </div>
    </MainLayout>
  )
}
