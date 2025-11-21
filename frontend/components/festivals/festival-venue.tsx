"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building, Ticket, ParkingCircle, Wifi, Accessibility } from "lucide-react"

interface Venue {
  id: string
  name: string
  address: string
  description?: string
  capacity?: number
  imageUrl?: string // URL for an image of the venue
  mapEmbedUrl?: string // URL for an embeddable map (e.g., Google Maps iframe src)
  amenities?: string[] // e.g., "Wheelchair Accessible", "Cafe", "Restrooms"
  transportLinks?: string[] // e.g., "Metro Line A", "Bus Stop 12"
}

interface FestivalVenueProps {
  venue: Venue // Assuming a single main venue for simplicity, or an array for multiple
}

// Mock data for a single venue
const mockVenue: Venue = {
  id: "venue-palais",
  name: "Palais des Festivals et des Congrès",
  address: "1 Boulevard de la Croisette, 06400 Cannes, France",
  description:
    "The iconic main venue for the Cannes Film Festival, hosting premieres, press conferences, and market screenings.",
  capacity: 2300, // For the Grand Théâtre Lumière
  imageUrl: "/placeholder.svg?height=300&width=500",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2890.585858887074!2d7.015099015495013!3d43.55127097912484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12ce8198db956b7b%3A0x291ab34872499798!2sPalais%20des%20Festivals%20et%20des%20Congr%C3%A8s%20de%20Cannes!5e0!3m2!1sen!2sus!4v1678886000000",
  amenities: ["Wheelchair Accessible", "Press Rooms", "WiFi", "Cafe", "Restrooms"],
  transportLinks: ["Cannes SNCF Station (10 min walk)", "Bus lines 8, 18, 20"],
}

const AmenityIcon = ({ amenity }: { amenity: string }) => {
  if (amenity.toLowerCase().includes("wifi")) return <Wifi className="h-4 w-4 mr-1.5 text-sky-400" />
  if (amenity.toLowerCase().includes("accessible")) return <Accessibility className="h-4 w-4 mr-1.5 text-green-400" />
  if (amenity.toLowerCase().includes("parking")) return <ParkingCircle className="h-4 w-4 mr-1.5 text-blue-400" />
  return <Ticket className="h-4 w-4 mr-1.5 text-gray-400" /> // Default
}

export function FestivalVenue({ venue = mockVenue }: FestivalVenueProps) {
  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold text-gray-100 mb-6 px-4 md:px-0">Venue Information</h2>
      <Card className="bg-gray-800 border-gray-700 text-gray-100 overflow-hidden">
        {venue.imageUrl && (
          <div className="relative h-64 md:h-80 w-full">
            <img src={venue.imageUrl || "/placeholder.svg"} alt={venue.name} className="w-full h-full object-cover" />
          </div>
        )}
        <CardHeader className="p-6">
          <CardTitle className="text-2xl flex items-center">
            <Building className="h-7 w-7 mr-3 text-sky-400" /> {venue.name}
          </CardTitle>
          <div className="flex items-center text-gray-400 mt-1">
            <MapPin className="h-4 w-4 mr-2" />
            <p>{venue.address}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {venue.description && <p className="text-gray-300 leading-relaxed">{venue.description}</p>}

          <div className="grid md:grid-cols-2 gap-6">
            {venue.amenities && venue.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Amenities</h3>
                <ul className="space-y-1.5">
                  {venue.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center text-gray-300 text-sm">
                      <AmenityIcon amenity={amenity} /> {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {venue.transportLinks && venue.transportLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Getting There</h3>
                <ul className="space-y-1.5">
                  {venue.transportLinks.map((link) => (
                    <li key={link} className="flex items-center text-gray-300 text-sm">
                      <MapPin className="h-4 w-4 mr-1.5 text-yellow-400" /> {link}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {venue.mapEmbedUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Location Map</h3>
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-700">
                <iframe
                  src={venue.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${venue.name} Location Map`}
                ></iframe>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
