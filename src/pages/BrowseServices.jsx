import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Star, ChevronDown, X, Grid3X3, List } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import { SERVICE_CATEGORIES, LOCATIONS } from '../utils/constants';
import './BrowseServices.css';

// Demo services data
const DEMO_SERVICES = [
  { id: '1', title: 'Professional Home Cleaning', providerName: 'Ashan Madusanka', category: 'home-cleaning', price: 3500, priceType: 'fixed', rating: 4.9, reviewCount: 156, location: 'Colombo', description: 'Complete home cleaning service including deep cleaning of kitchen, bathrooms, and all rooms.', verified: true },
  { id: '2', title: 'Emergency Plumbing Service', providerName: 'Kamal Dissanayake', category: 'plumbing', price: 2000, priceType: 'hourly', rating: 4.8, reviewCount: 89, location: 'Gampaha', description: 'Fast and reliable plumbing repairs, leak fixes, and pipe installations.', verified: true },
  { id: '3', title: 'Electrical Wiring & Repairs', providerName: 'Nimal Perera', category: 'electrical', price: 1500, priceType: 'hourly', rating: 4.7, reviewCount: 134, location: 'Kottawa', description: 'Licensed electrician for wiring, installation, and electrical repair work.', verified: true },
  { id: '4', title: 'Wedding Photography Package', providerName: 'Saman Kumara', category: 'photography', price: 25000, priceType: 'starting', rating: 5.0, reviewCount: 76, location: 'Colombo', description: 'Professional wedding photography with editing and album delivery.', verified: true },
  { id: '5', title: 'Full-Stack Web Development', providerName: 'Dilshan Fernando', category: 'web-development', price: 50000, priceType: 'starting', rating: 4.9, reviewCount: 234, location: 'Colombo', description: 'Custom websites and web applications using modern technologies.', verified: false },
  { id: '6', title: 'Same-Day Delivery Service', providerName: 'Ravi Jayasuriya', category: 'delivery', price: 500, priceType: 'starting', rating: 4.6, reviewCount: 312, location: 'Colombo', description: 'Fast same-day delivery across Colombo and suburbs.', verified: true },
  { id: '7', title: 'Interior & Exterior Painting', providerName: 'Tharindu Silva', category: 'painting', price: 5000, priceType: 'starting', rating: 4.8, reviewCount: 67, location: 'Negombo', description: 'Quality paint jobs for residential and commercial properties.', verified: true },
  { id: '8', title: 'Math & Science Tutoring', providerName: 'Priyantha A.', category: 'tutoring', price: 1500, priceType: 'hourly', rating: 4.9, reviewCount: 198, location: 'Dehiwala', description: 'Expert tutoring for O/L and A/L exams in mathematics and science.', verified: true },
  { id: '9', title: 'Custom Furniture Making', providerName: 'Bandara K.', category: 'carpentry', price: 15000, priceType: 'starting', rating: 4.7, reviewCount: 45, location: 'Moratuwa', description: 'Handcrafted custom furniture and woodwork for homes and offices.', verified: false },
];

const BrowseServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const filteredServices = DEMO_SERVICES.filter(service => {
    const matchesSearch = !searchQuery || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesLocation = !selectedLocation || service.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });

  const formatPrice = (price, type) => {
    const formatted = `LKR ${price.toLocaleString()}`;
    if (type === 'hourly') return `${formatted}/hr`;
    if (type === 'starting') return `From ${formatted}`;
    return formatted;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSortBy('relevance');
  };

  const activeFilterCount = [searchQuery, selectedCategory, selectedLocation].filter(Boolean).length;

  return (
    <div className="browse-page page-content">
      <div className="container">
        {/* Page Header */}
        <div className="browse-header">
          <h1>Browse Services</h1>
          <p>Find the perfect professional for your needs</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="browse-search-bar">
          <div className="browse-search-input-wrapper">
            <Search size={20} className="browse-search-icon" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="browse-search-input"
            />
            {searchQuery && (
              <button className="browse-search-clear" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <select
            className="browse-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            className="browse-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            className="browse-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <div className="browse-view-toggle">
            <button className={`browse-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><Grid3X3 size={18} /></button>
            <button className={`browse-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={18} /></button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="browse-active-filters">
            <span className="browse-filter-count">{filteredServices.length} results</span>
            {selectedCategory && (
              <Badge variant="primary" size="md">
                {SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
              </Badge>
            )}
            {selectedLocation && (
              <Badge variant="primary" size="md">
                <MapPin size={12} /> {selectedLocation}
                <button onClick={() => setSelectedLocation('')}><X size={12} /></button>
              </Badge>
            )}
            <button className="browse-clear-all" onClick={clearFilters}>Clear All</button>
          </div>
        )}

        {/* Service Cards */}
        <div className={`browse-grid ${viewMode === 'list' ? 'browse-list-view' : ''}`}>
          {filteredServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link to={`/service/${service.id}`} className="service-card-link">
                <Card variant="default" padding="none" hover>
                  <div className="service-card-banner" style={{ background: `linear-gradient(135deg, ${service.category === 'photography' ? '#1B3561' : '#2359C8'}20, ${service.category === 'photography' ? '#3B80E8' : '#1B3561'}10)` }}>
                    <Badge variant={service.verified ? 'success' : 'default'} size="sm">
                      {service.verified ? '✓ Verified' : 'New'}
                    </Badge>
                    <Badge variant="dark" size="sm">{SERVICE_CATEGORIES.find(c => c.id === service.category)?.name || service.category}</Badge>
                  </div>
                  <div className="service-card-body">
                    <div className="service-card-provider">
                      <Avatar name={service.providerName} size="sm" />
                      <span className="service-card-provider-name">{service.providerName}</span>
                    </div>
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-desc">{service.description}</p>
                    <div className="service-card-footer">
                      <Rating value={service.rating} count={service.reviewCount} size="sm" />
                      <div className="service-card-price-location">
                        <span className="service-card-price">{formatPrice(service.price, service.priceType)}</span>
                        <span className="service-card-location"><MapPin size={12} /> {service.location}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="browse-empty">
            <Search size={48} />
            <h3>No services found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <Button variant="primary" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseServices;
