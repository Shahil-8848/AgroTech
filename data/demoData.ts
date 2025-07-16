import { Equipment, Service, Post, User } from '../store/useAppStore';

// Demo Users
export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Ramesh Patil',
    email: 'ramesh@example.com',
    phone: '+91 9876543210',
    location: 'Pune, Maharashtra',
    role: 'contractor',
    rating: 4.8,
    verified: true,
    description: 'Experienced tractor operator with 15+ years in farming'
  },
  {
    id: '2',
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    phone: '+91 9876543211',
    location: 'Nashik, Maharashtra',
    role: 'contractor',
    rating: 4.6,
    verified: true,
    description: 'Modern farming equipment provider'
  },
  {
    id: '3',
    name: 'Anand Sharma',
    email: 'anand@example.com',
    phone: '+91 9876543212',
    location: 'Solapur, Maharashtra',
    role: 'contractor',
    rating: 4.9,
    verified: true,
    description: 'Irrigation specialist and pump rental services'
  },
  {
    id: '4',
    name: 'Dr. Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543213',
    location: 'Mumbai, Maharashtra',
    role: 'general',
    rating: 4.9,
    verified: true,
    description: 'Agricultural consultant and expert'
  }
];

// Demo Equipment
export const demoEquipment: Equipment[] = [
  {
    id: '1',
    title: 'John Deere 5050D Tractor',
    description: 'Powerful 50HP tractor perfect for medium-scale farming operations. Well-maintained and regularly serviced.',
    category: 'tractor',
    pricePerHour: 500,
    pricePerDay: 2500,
    images: [
      'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2252616/pexels-photo-2252616.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    owner: demoUsers[0],
    location: 'Pune, Maharashtra',
    available: true,
    rating: 4.8,
    reviewCount: 24,
    specifications: {
      brand: 'John Deere',
      model: '5050D',
      year: 2020,
      power: '50 HP',
      capacity: '2000 kg'
    },
    features: ['Power Steering', 'Hydraulic Lift', 'PTO', 'Comfortable Seat'],
    createdAt: '2024-01-15',
    bookedDates: ['2024-02-01', '2024-02-02', '2024-02-15']
  },
  {
    id: '2',
    title: 'Mahindra Arjun 605 DI',
    description: 'Reliable 60HP tractor with excellent fuel efficiency. Ideal for all farming activities.',
    category: 'tractor',
    pricePerHour: 600,
    pricePerDay: 3000,
    images: [
      'https://images.pexels.com/photos/2252616/pexels-photo-2252616.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    owner: demoUsers[1],
    location: 'Nashik, Maharashtra',
    available: true,
    rating: 4.6,
    reviewCount: 18,
    specifications: {
      brand: 'Mahindra',
      model: 'Arjun 605 DI',
      year: 2019,
      power: '60 HP',
      capacity: '2200 kg'
    },
    features: ['Dual Clutch', 'Oil Immersed Brakes', 'Advanced Hydraulics'],
    createdAt: '2024-01-10',
    bookedDates: ['2024-02-05', '2024-02-06']
  },
  {
    id: '3',
    title: 'New Holland TC 5070',
    description: 'Modern harvester with GPS guidance system. Perfect for wheat and rice harvesting.',
    category: 'harvester',
    pricePerHour: 800,
    pricePerDay: 4000,
    images: [
      'https://images.pexels.com/photos/2252616/pexels-photo-2252616.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    owner: demoUsers[1],
    location: 'Nashik, Maharashtra',
    available: true,
    rating: 4.7,
    reviewCount: 12,
    specifications: {
      brand: 'New Holland',
      model: 'TC 5070',
      year: 2021,
      power: '140 HP',
      capacity: '5000 kg/hr'
    },
    features: ['GPS Navigation', 'Auto Steering', 'Grain Tank Monitor'],
    createdAt: '2024-01-08',
    bookedDates: []
  },
  {
    id: '4',
    title: 'Kirloskar Irrigation Pump',
    description: 'High-efficiency water pump for irrigation. Suitable for 5-10 acre farms.',
    category: 'irrigation',
    pricePerHour: 150,
    pricePerDay: 800,
    images: [
      'https://images.pexels.com/photos/5623533/pexels-photo-5623533.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    owner: demoUsers[2],
    location: 'Solapur, Maharashtra',
    available: true,
    rating: 4.9,
    reviewCount: 31,
    specifications: {
      brand: 'Kirloskar',
      model: 'KDS-215',
      year: 2022,
      power: '15 HP',
      capacity: '1000 LPM'
    },
    features: ['Self Priming', 'Corrosion Resistant', 'Energy Efficient'],
    createdAt: '2024-01-12',
    bookedDates: ['2024-02-03', '2024-02-04']
  },
  {
    id: '5',
    title: 'DJI Agras T30 Drone',
    description: 'Professional agricultural drone for precision spraying and crop monitoring.',
    category: 'drone',
    pricePerHour: 1200,
    pricePerDay: 6000,
    images: [
      'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    owner: demoUsers[0],
    location: 'Pune, Maharashtra',
    available: false,
    rating: 4.9,
    reviewCount: 8,
    specifications: {
      brand: 'DJI',
      model: 'Agras T30',
      year: 2023,
      capacity: '30L Tank',
      power: 'Electric'
    },
    features: ['AI Recognition', 'Precision Spraying', 'Real-time Monitoring'],
    createdAt: '2024-01-20',
    bookedDates: ['2024-02-01', '2024-02-02', '2024-02-03']
  },
  {
    id: '6',
    title: 'Rotary Tiller Attachment',
    description: 'Heavy-duty rotary tiller for soil preparation. Compatible with most tractors.',
    category: 'tools',
    pricePerHour: 300,
    pricePerDay: 1500,
    images: [
      'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    owner: demoUsers[1],
    location: 'Nashik, Maharashtra',
    available: true,
    rating: 4.5,
    reviewCount: 15,
    specifications: {
      brand: 'Fieldking',
      model: 'RT-180',
      year: 2020,
      power: 'PTO Driven',
      capacity: '6 feet'
    },
    features: ['Adjustable Depth', 'Heavy Duty Blades', 'Universal Coupling'],
    createdAt: '2024-01-05',
    bookedDates: []
  }
];

// Demo Services
export const demoServices: Service[] = [
  {
    id: '1',
    title: 'Professional Plowing Service',
    description: 'Expert plowing service with modern equipment. Suitable for all soil types.',
    category: 'plowing',
    pricePerHour: 800,
    pricePerDay: 4000,
    provider: demoUsers[0],
    location: 'Pune, Maharashtra',
    available: true,
    rating: 4.8,
    reviewCount: 45,
    skills: ['Deep Plowing', 'Contour Plowing', 'Soil Preparation'],
    experience: 15,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Crop Harvesting Service',
    description: 'Complete harvesting solution with experienced team and modern machinery.',
    category: 'harvesting',
    pricePerHour: 1000,
    pricePerDay: 5000,
    provider: demoUsers[1],
    location: 'Nashik, Maharashtra',
    available: true,
    rating: 4.7,
    reviewCount: 32,
    skills: ['Wheat Harvesting', 'Rice Harvesting', 'Post-harvest Processing'],
    experience: 12,
    createdAt: '2024-01-08'
  }
];

// Demo Posts
export const demoPosts: Post[] = [
  {
    id: '1',
    author: demoUsers[0],
    content: 'Just finished harvesting my wheat crop! The yield this year is exceptional thanks to the new irrigation system. Any tips for storing wheat to prevent pest damage?',
    type: 'text',
    likes: 24,
    comments: 8,
    saved: false,
    createdAt: '2024-01-25T10:30:00Z',
    tags: ['wheat', 'harvest', 'storage']
  },
  {
    id: '2',
    author: demoUsers[3],
    content: 'Organic farming tip: Use neem oil spray as a natural pesticide. It\'s effective against aphids and doesn\'t harm beneficial insects. Best applied in the evening.',
    type: 'tip',
    likes: 56,
    comments: 12,
    saved: true,
    createdAt: '2024-01-25T08:15:00Z',
    tags: ['organic', 'pesticide', 'neem']
  },
  {
    id: '3',
    author: demoUsers[1],
    content: 'My new harvester is available for booking in Nashik district. Special rates for small farmers. DM me for details!',
    type: 'service',
    likes: 18,
    comments: 5,
    saved: false,
    createdAt: '2024-01-25T06:45:00Z',
    tags: ['harvester', 'rental', 'nashik']
  },
  {
    id: '4',
    author: demoUsers[2],
    content: 'Question: What\'s the best time to plant tomatoes in Maharashtra? I\'m planning to start a kitchen garden.',
    type: 'question',
    likes: 32,
    comments: 15,
    saved: false,
    createdAt: '2024-01-24T16:20:00Z',
    tags: ['tomatoes', 'planting', 'kitchen-garden']
  }
];