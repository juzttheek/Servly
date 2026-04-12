import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Shield, Calendar, MessageSquare, CheckCircle, Briefcase } from 'lucide-react';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import Card from '../components/common/Card';
import './ProviderProfile.css';

const ProviderProfile = () => {
  const { id } = useParams();

  const provider = {
    id,
    name: 'Ashan Madusanka',
    bio: 'Professional home cleaning expert with over 8 years of experience. I take pride in delivering spotless results with eco-friendly products. Available for residential and commercial cleaning across Colombo.',
    location: 'Colombo, Sri Lanka',
    rating: 4.9,
    reviewCount: 156,
    completedJobs: 342,
    memberSince: 'January 2024',
    responseTime: '< 1 hour',
    verified: true,
    skills: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Window Cleaning', 'Carpet Cleaning', 'Move-in/Move-out'],
    services: [
      { id: '1', title: 'Professional Home Cleaning', price: 3500, rating: 4.9, reviews: 156, category: 'Home Cleaning' },
      { id: '2', title: 'Office Cleaning Service', price: 5000, rating: 4.8, reviews: 67, category: 'Commercial' },
      { id: '3', title: 'Deep Kitchen Cleaning', price: 2500, rating: 5.0, reviews: 43, category: 'Home Cleaning' },
    ],
    reviews: [
      { id: 1, name: 'Nadeesha P.', rating: 5, text: 'Excellent service! Very detailed and professional.', date: 'Mar 2026' },
      { id: 2, name: 'Chamara R.', rating: 5, text: 'Best cleaning service I\'ve ever used. Highly recommend!', date: 'Feb 2026' },
    ]
  };

  return (
    <div className="profile-page page-content">
      <div className="container">
        {/* Profile Header */}
        <motion.div className="profile-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="profile-hero-bg" />
          <div className="profile-hero-content">
            <Avatar name={provider.name} size="2xl" />
            <div className="profile-hero-info">
              <div className="profile-hero-name-row">
                <h1>{provider.name}</h1>
                {provider.verified && <Badge variant="success" size="md"><Shield size={14} /> Verified</Badge>}
              </div>
              <div className="profile-hero-meta">
                <span><MapPin size={16} /> {provider.location}</span>
                <span><Clock size={16} /> Responds {provider.responseTime}</span>
                <span><Calendar size={16} /> Member since {provider.memberSince}</span>
              </div>
              <Rating value={provider.rating} count={provider.reviewCount} size="md" />
            </div>
            <div className="profile-hero-actions">
              <Link to="/chat"><Button variant="primary" icon={MessageSquare}>Message</Button></Link>
              <Button variant="secondary">Hire Now</Button>
            </div>
          </div>
        </motion.div>

        <div className="profile-layout">
          <div className="profile-main">
            {/* Bio */}
            <div className="profile-section">
              <h3>About</h3>
              <p>{provider.bio}</p>
            </div>

            {/* Skills */}
            <div className="profile-section">
              <h3>Skills & Expertise</h3>
              <div className="profile-skills">
                {provider.skills.map((skill, i) => (
                  <Badge key={i} variant="primary" size="lg">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="profile-section">
              <h3>Services</h3>
              <div className="profile-services">
                {provider.services.map(service => (
                  <Link to={`/service/${service.id}`} key={service.id}>
                    <Card variant="default" padding="md" hover>
                      <div className="profile-service-card">
                        <Badge variant="default" size="sm">{service.category}</Badge>
                        <h4>{service.title}</h4>
                        <div className="profile-service-footer">
                          <Rating value={service.rating} count={service.reviews} size="sm" />
                          <span className="profile-service-price">LKR {service.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="profile-section">
              <h3>Reviews</h3>
              <div className="profile-reviews">
                {provider.reviews.map(review => (
                  <div key={review.id} className="profile-review">
                    <div className="profile-review-top">
                      <Avatar name={review.name} size="sm" />
                      <div>
                        <p className="profile-review-name">{review.name}</p>
                        <p className="profile-review-date">{review.date}</p>
                      </div>
                      <Rating value={review.rating} size="sm" className="profile-review-stars" />
                    </div>
                    <p className="profile-review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="profile-sidebar">
            <Card variant="default" padding="md" hover={false}>
              <div className="profile-stats">
                <div className="profile-stat">
                  <Briefcase size={20} />
                  <div>
                    <span className="profile-stat-val">{provider.completedJobs}</span>
                    <span className="profile-stat-label">Jobs Completed</span>
                  </div>
                </div>
                <div className="profile-stat">
                  <Star size={20} />
                  <div>
                    <span className="profile-stat-val">{provider.rating}</span>
                    <span className="profile-stat-label">Average Rating</span>
                  </div>
                </div>
                <div className="profile-stat">
                  <Clock size={20} />
                  <div>
                    <span className="profile-stat-val">{provider.responseTime}</span>
                    <span className="profile-stat-label">Response Time</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
