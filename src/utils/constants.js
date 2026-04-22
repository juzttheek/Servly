import { 
  Home, Truck, FileText, Wrench, Paintbrush, Zap, 
  Camera, Code, Hammer, Stethoscope, GraduationCap, 
  Leaf, Scale, Brain, Briefcase, Plane, User,
  Monitor, AlertTriangle, Heart, Scissors, Utensils,
  Car, Package, MapPin as MapPinIcon, PenTool, Video,
  Share2, BookOpen, Globe, Calculator, Building,
  Megaphone, Users, Phone, ShieldCheck, Dumbbell,
  Pill, FlaskConical, Baby, Lightbulb, Languages
} from 'lucide-react';

export const APP_NAME = 'Servly';
export const APP_SLOGAN = 'From Home Repairs to Legal Advice — Everything on Servly.';
export const APP_DESCRIPTION = 'Sri Lanka\'s First All-in-One Service Platform — connecting customers with trusted service providers across every industry.';

export const SERVICE_CATEGORIES = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: Home,
    emoji: '🏠',
    description: 'Expert home maintenance and repair professionals at your doorstep',
    color: '#2563EB',
    count: 412,
    subcategories: [
      { id: 'electricians', name: 'Electricians' },
      { id: 'plumbers', name: 'Plumbers' },
      { id: 'cleaning', name: 'Cleaning Services' },
      { id: 'ac-repair', name: 'AC Repair' },
      { id: 'carpentry', name: 'Carpentry' },
      { id: 'painting', name: 'Painting' }
    ]
  },
  {
    id: 'legal-services',
    name: 'Legal Services',
    icon: Scale,
    emoji: '⚖️',
    description: 'Professional legal advice, documentation, and representation',
    color: '#7C3AED',
    count: 156,
    subcategories: [
      { id: 'lawyers', name: 'Lawyers / Attorneys' },
      { id: 'notary', name: 'Notary Services' },
      { id: 'doc-verification', name: 'Document Verification' },
      { id: 'contract-drafting', name: 'Contract Drafting' },
      { id: 'legal-consultation', name: 'Legal Consultation' }
    ]
  },
  {
    id: 'medical-health',
    name: 'Medical & Health',
    icon: Stethoscope,
    emoji: '🏥',
    description: 'Trusted healthcare professionals and medical services',
    color: '#DC2626',
    count: 234,
    subcategories: [
      { id: 'doctor-consultation', name: 'Doctor Consultation' },
      { id: 'medical-advisors', name: 'Medical Advisors' },
      { id: 'home-nursing', name: 'Home Nursing' },
      { id: 'pharmacy-delivery', name: 'Pharmacy Delivery' },
      { id: 'lab-testing', name: 'Lab Testing Services' }
    ]
  },
  {
    id: 'therapy-wellness',
    name: 'Therapy & Wellness',
    icon: Brain,
    emoji: '🧠',
    description: 'Mental health support, fitness, and holistic wellness',
    color: '#0D9488',
    count: 178,
    subcategories: [
      { id: 'counseling', name: 'Counseling' },
      { id: 'mental-health', name: 'Mental Health Therapy' },
      { id: 'fitness-trainers', name: 'Fitness Trainers' },
      { id: 'yoga', name: 'Yoga Instructors' },
      { id: 'nutrition', name: 'Nutrition Experts' }
    ]
  },
  {
    id: 'education',
    name: 'Education Services',
    icon: GraduationCap,
    emoji: '🎓',
    description: 'Quality tutoring, skill development, and career guidance',
    color: '#EA580C',
    count: 298,
    subcategories: [
      { id: 'tutoring', name: 'Tutors (School / University)' },
      { id: 'online-classes', name: 'Online Classes' },
      { id: 'skill-development', name: 'Skill Development (IT, Language)' },
      { id: 'career-guidance', name: 'Career Guidance' }
    ]
  },
  {
    id: 'business-services',
    name: 'Business Services',
    icon: Briefcase,
    emoji: '💼',
    description: 'Accounting, tax, registration, and professional business support',
    color: '#1D4ED8',
    count: 187,
    subcategories: [
      { id: 'accounting', name: 'Accounting & Auditing' },
      { id: 'tax-consultants', name: 'Tax Consultants' },
      { id: 'business-registration', name: 'Business Registration' },
      { id: 'marketing-branding', name: 'Marketing & Branding' },
      { id: 'hr-recruitment', name: 'HR & Recruitment' }
    ]
  },
  {
    id: 'transport-logistics',
    name: 'Transport & Logistics',
    icon: Truck,
    emoji: '🚚',
    description: 'Reliable transport, delivery, and moving services',
    color: '#9333EA',
    count: 325,
    subcategories: [
      { id: 'taxi-hire', name: 'Taxi / Hire Vehicles' },
      { id: 'delivery-services', name: 'Delivery Services' },
      { id: 'moving-relocation', name: 'Moving & Relocation' },
      { id: 'courier', name: 'Courier Services' }
    ]
  },
  {
    id: 'tourism-travel',
    name: 'Tourism & Travel',
    icon: Plane,
    emoji: '✈️',
    description: 'Travel planning, tours, bookings, and unique experiences',
    color: '#0EA5E9',
    count: 143,
    subcategories: [
      { id: 'tour-guides', name: 'Tour Guides' },
      { id: 'hotel-bookings', name: 'Hotel Bookings' },
      { id: 'travel-planning', name: 'Travel Planning' },
      { id: 'vehicle-rental', name: 'Vehicle Rental' },
      { id: 'experience-packages', name: 'Experience Packages' }
    ]
  },
  {
    id: 'personal-services',
    name: 'Personal Services',
    icon: User,
    emoji: '👤',
    description: 'Beauty, photography, events, and personal assistance',
    color: '#DB2777',
    count: 267,
    subcategories: [
      { id: 'beauty-salon', name: 'Beauty & Salon' },
      { id: 'photography', name: 'Photography' },
      { id: 'event-planning', name: 'Event Planning' },
      { id: 'personal-assistants', name: 'Personal Assistants' },
      { id: 'home-chefs', name: 'Home Chefs' }
    ]
  },
  {
    id: 'digital-freelance',
    name: 'Digital & Freelance',
    icon: Monitor,
    emoji: '💻',
    description: 'Web development, design, content creation, and digital services',
    color: '#059669',
    count: 389,
    subcategories: [
      { id: 'graphic-design', name: 'Graphic Design' },
      { id: 'web-development', name: 'Web Development' },
      { id: 'social-media', name: 'Social Media Management' },
      { id: 'content-writing', name: 'Content Writing' },
      { id: 'video-editing', name: 'Video Editing' }
    ]
  },
  {
    id: 'quick-help',
    name: 'On-Demand Quick Help',
    icon: AlertTriangle,
    emoji: '🔧',
    description: '"Need help now" — emergency services and last-minute bookings',
    color: '#E11D48',
    count: 98,
    featured: true,
    subcategories: [
      { id: 'need-help-now', name: '"Need Help Now" Requests' },
      { id: 'emergency-services', name: 'Emergency Services' },
      { id: 'last-minute', name: 'Last-Minute Bookings' }
    ]
  }
];

// Flat list of all subcategories for search/filter
export const ALL_SUBCATEGORIES = SERVICE_CATEGORIES.flatMap(cat =>
  cat.subcategories.map(sub => ({
    ...sub,
    parentId: cat.id,
    parentName: cat.name,
    parentColor: cat.color
  }))
);

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
