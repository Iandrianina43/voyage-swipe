
export interface Place {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant';
  rating: number;
  price: number; // 1-4 for pricing level
  location: string;
  distance: string;
  imageUrl: string;
  description: string;
  features: string[];
}

export const dummyPlaces: Place[] = [
  {
    id: "hotel-1",
    name: "Oceanview Resort",
    type: "hotel",
    rating: 4.8,
    price: 3,
    location: "Malibu, CA",
    distance: "3.2 miles away",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1760&auto=format&fit=crop",
    description: "Luxurious beachfront resort with panoramic ocean views, spa facilities, and fine dining options.",
    features: ["Beachfront", "Pool", "Spa", "Restaurant", "Free WiFi"]
  },
  {
    id: "hotel-2",
    name: "Mountain Retreat Lodge",
    type: "hotel",
    rating: 4.6,
    price: 2,
    location: "Aspen, CO",
    distance: "5.7 miles away",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740&auto=format&fit=crop",
    description: "Cozy mountain lodge surrounded by nature with rustic charm and modern amenities.",
    features: ["Mountain view", "Fireplace", "Hiking trails", "Continental breakfast", "Pet friendly"]
  },
  {
    id: "hotel-3",
    name: "Urban Boutique Hotel",
    type: "hotel",
    rating: 4.5,
    price: 3,
    location: "New York, NY",
    distance: "0.8 miles away",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1740&auto=format&fit=crop",
    description: "Stylish boutique hotel in the heart of the city, featuring contemporary design and personalized service.",
    features: ["City view", "Rooftop bar", "Fitness center", "Room service", "Business facilities"]
  },
  {
    id: "hotel-4",
    name: "Desert Oasis Resort",
    type: "hotel",
    rating: 4.7,
    price: 4,
    location: "Sedona, AZ",
    distance: "7.3 miles away",
    imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1740&auto=format&fit=crop",
    description: "Luxury desert resort with stunning red rock views, infinity pools, and world-class spa treatments.",
    features: ["Desert view", "Infinity pool", "Spa", "Golf course", "Fine dining"]
  },
  {
    id: "restaurant-1",
    name: "Coastal Kitchen",
    type: "restaurant",
    rating: 4.7,
    price: 3,
    location: "Santa Monica, CA",
    distance: "2.1 miles away",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1674&auto=format&fit=crop",
    description: "Fresh seafood restaurant with ocean views and locally sourced ingredients prepared with Mediterranean influences.",
    features: ["Seafood", "Outdoor seating", "Ocean view", "Full bar", "Vegetarian options"]
  },
  {
    id: "restaurant-2",
    name: "Trattoria Milano",
    type: "restaurant",
    rating: 4.6,
    price: 2,
    location: "Boston, MA",
    distance: "1.4 miles away",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1740&auto=format&fit=crop",
    description: "Authentic Italian trattoria serving homemade pasta, wood-fired pizza, and traditional recipes from Milan.",
    features: ["Italian cuisine", "Wine selection", "Homemade pasta", "Wood-fired oven", "Family-friendly"]
  },
  {
    id: "restaurant-3",
    name: "Fusion Bistro",
    type: "restaurant",
    rating: 4.8,
    price: 4,
    location: "Chicago, IL",
    distance: "0.9 miles away",
    imageUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1752&auto=format&fit=crop",
    description: "Innovative fusion restaurant combining Asian and French techniques with a seasonal, locally-sourced menu.",
    features: ["Asian-French fusion", "Tasting menu", "Craft cocktails", "Elegant ambiance", "Award-winning chef"]
  },
  {
    id: "restaurant-4",
    name: "Smoky BBQ Joint",
    type: "restaurant",
    rating: 4.5,
    price: 2,
    location: "Austin, TX",
    distance: "3.8 miles away",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
    description: "Authentic Texas BBQ joint with slow-smoked meats, homestyle sides, and craft beer selection.",
    features: ["BBQ", "Craft beer", "Live music", "Outdoor seating", "Family-style"]
  }
];
