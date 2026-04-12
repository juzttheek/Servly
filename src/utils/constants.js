import { 
  Home, Truck, FileText, Wrench, Paintbrush, Zap, 
  Camera, Code, Hammer, Stethoscope, GraduationCap, 
  Leaf
} from 'lucide-react';

export const APP_NAME = 'Servly';
export const APP_SLOGAN = 'Real People. Smart Solutions.';
export const APP_DESCRIPTION = 'Sri Lanka\'s smart service marketplace connecting customers with trusted service providers.';

export const SERVICE_CATEGORIES = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: Home,
    description: 'Professional cleaning services for your home',
    color: '#2359C8',
    count: 145
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: Wrench,
    description: 'Expert plumbing repairs and installations',
    color: '#3B80E8',
    count: 89
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: Zap,
    description: 'Licensed electrical services and repairs',
    color: '#1B3561',
    count: 112
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: Paintbrush,
    description: 'Interior and exterior painting services',
    color: '#2359C8',
    count: 67
  },
  {
    id: 'delivery',
    name: 'Delivery & Logistics',
    icon: Truck,
    description: 'Fast and reliable delivery solutions',
    color: '#3B80E8',
    count: 203
  },
  {
    id: 'documentation',
    name: 'Documentation',
    icon: FileText,
    description: 'Document processing and insurance support',
    color: '#1B3561',
    count: 54
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    description: 'Professional photography and videography',
    color: '#2359C8',
    count: 98
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: Code,
    description: 'Custom websites and web applications',
    color: '#3B80E8',
    count: 176
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: GraduationCap,
    description: 'Expert tutoring in all subjects',
    color: '#1B3561',
    count: 134
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: Hammer,
    description: 'Custom woodwork and furniture repairs',
    color: '#2359C8',
    count: 45
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Stethoscope,
    description: 'Home healthcare and wellness services',
    color: '#3B80E8',
    count: 78
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: Leaf,
    description: 'Garden maintenance and landscaping',
    color: '#1B3561',
    count: 62
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Search & Discover',
    description: 'Browse through hundreds of verified service providers or post your specific requirement.'
  },
  {
    step: 2,
    title: 'Connect & Discuss',
    description: 'Chat directly with providers, compare quotes, and choose the best match for your needs.'
  },
  {
    step: 3,
    title: 'Get It Done',
    description: 'Book the service, track progress in real-time, and leave a review when satisfied.'
  }
];

export const STATS = [
  { label: 'Active Providers', value: 2500, suffix: '+' },
  { label: 'Services Completed', value: 15000, suffix: '+' },
  { label: 'Cities Covered', value: 12, suffix: '' },
  { label: 'Happy Customers', value: 10000, suffix: '+' }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Amara Perera',
    role: 'Homeowner, Colombo',
    avatar: null,
    rating: 5,
    text: 'Servly made finding a reliable plumber so easy! Within 30 minutes, I had three quotes and the job was done the same day. Amazing service!'
  },
  {
    id: 2,
    name: 'Kasun Fernando',
    role: 'Business Owner, Gampaha',
    avatar: null,
    rating: 5,
    text: 'As a small business owner, I needed quick document processing. Servly connected me with a verified agent who handled everything professionally.'
  },
  {
    id: 3,
    name: 'Dilini Jayawardena',
    role: 'Freelancer, Kottawa',
    avatar: null,
    rating: 5,
    text: 'I joined as a provider and within the first week, I had 5 photography bookings. The platform is clean, fast, and the support team is incredible.'
  }
];

export const LOCATIONS = [
  'Colombo',
  'Gampaha',
  'Kottawa',
  'Kandy',
  'Galle',
  'Negombo',
  'Dehiwala',
  'Moratuwa',
  'Battaramulla',
  'Maharagama',
  'Nugegoda',
  'Rajagiriya'
];

export const PRICE_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Per Hour' },
  { value: 'starting', label: 'Starting From' }
];

export const BOOKING_STATUS = {
  pending: { label: 'Pending', color: '#F59E0B' },
  confirmed: { label: 'Confirmed', color: '#2359C8' },
  'in-progress': { label: 'In Progress', color: '#3B80E8' },
  completed: { label: 'Completed', color: '#22C55E' },
  cancelled: { label: 'Cancelled', color: '#EF4444' }
};

export const REQUEST_STATUS = {
  open: { label: 'Open', color: '#22C55E' },
  'in-progress': { label: 'In Progress', color: '#3B80E8' },
  completed: { label: 'Completed', color: '#6B7A99' },
  cancelled: { label: 'Cancelled', color: '#EF4444' }
};
