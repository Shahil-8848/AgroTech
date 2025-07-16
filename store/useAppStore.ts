import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'farmer' | 'contractor' | 'general';
  avatar?: string;
  rating: number;
  verified: boolean;
  description?: string;
}

export interface Equipment {
  id: string;
  title: string;
  description: string;
  category: 'tractor' | 'harvester' | 'irrigation' | 'tools' | 'drone';
  pricePerHour: number;
  pricePerDay: number;
  images: string[];
  owner: User;
  location: string;
  available: boolean;
  rating: number;
  reviewCount: number;
  specifications: {
    brand: string;
    model: string;
    year: number;
    power?: string;
    capacity?: string;
  };
  features: string[];
  createdAt: string;
  bookedDates: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'plowing' | 'harvesting' | 'spraying' | 'irrigation' | 'consultation';
  pricePerHour: number;
  pricePerDay: number;
  provider: User;
  location: string;
  available: boolean;
  rating: number;
  reviewCount: number;
  skills: string[];
  experience: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  equipmentId?: string;
  serviceId?: string;
  farmerId: string;
  contractorId: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  type: 'text' | 'question' | 'tip' | 'service' | 'requirement';
  images?: string[];
  likes: number;
  comments: number;
  saved: boolean;
  createdAt: string;
  tags?: string[];
}

interface AppState {
  user: User | null;
  equipment: Equipment[];
  services: Service[];
  bookings: Booking[];
  posts: Post[];
  selectedEquipment: Equipment | null;
  selectedService: Service | null;
  searchQuery: string;
  selectedCategory: string;
  
  // Actions
  setUser: (user: User) => void;
  setEquipment: (equipment: Equipment[]) => void;
  addEquipment: (equipment: Equipment) => void;
  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  setSelectedEquipment: (equipment: Equipment | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  equipment: [],
  services: [],
  bookings: [],
  posts: [],
  selectedEquipment: null,
  selectedService: null,
  searchQuery: '',
  selectedCategory: 'all',

  setUser: (user) => set({ user }),
  setEquipment: (equipment) => set({ equipment }),
  addEquipment: (equipment) => set((state) => ({ 
    equipment: [...state.equipment, equipment] 
  })),
  setServices: (services) => set({ services }),
  addService: (service) => set((state) => ({ 
    services: [...state.services, service] 
  })),
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking] 
  })),
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  setSelectedEquipment: (equipment) => set({ selectedEquipment: equipment }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  togglePostLike: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    )
  })),
  
  togglePostSave: (postId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved }
        : post
    )
  })),
}));