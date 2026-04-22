import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Shield, Star, MessageSquare, Calendar, CheckCircle, ChevronRight, Share2, Heart, Flag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import { useAuth } from '../context/AuthContext';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Demo service data
  const service = {
    id,
    title: 'Professional Home Cleaning Service',
    providerName: 'Ashan Madusanka',
    providerId: 'p1',
    category: 'Home Cleaning',
    price: 3500,
    priceType: 'fixed',
    rating: 4.9,
    reviewCount: 156,
    location: 'Colombo',
    responseTime: '< 1 hour',
    completedJobs: 342,
    memberSince: 'Jan 2024',
    verified: true,
    description: `Professional home cleaning service that covers every corner of your home. Our team uses eco-friendly products and modern equipment to ensure a spotless clean every time.

We are committed to delivering exceptional cleaning services that exceed your expectations. Each cleaning session is tailored to your specific needs and preferences.`,
    highlights: [
      'Eco-friendly cleaning products',
      'Professional-grade equipment',
      'Trained & uniformed staff',
      'Satisfaction guaranteed',
      'Flexible scheduling',
      'Deep cleaning available',
    ],
    packages: [
      { name: 'Basic Clean', price: 3500, features: ['Living room & bedrooms', '2 bathrooms', 'Kitchen surface clean', '2-3 hours'] },
      { name: 'Deep Clean', price: 6000, features: ['All rooms included', 'Deep kitchen clean', 'Window cleaning', 'Appliance cleaning', '4-5 hours'] },
      { name: 'Premium', price: 9500, features: ['Everything in Deep Clean', 'Carpet shampooing', 'Upholstery cleaning', 'Organizing', '6-8 hours'] },
    ],
    reviews: [
      { id: 1, name: 'Nadeesha Perera', rating: 5, date: 'Mar 2026', text: 'Absolutely wonderful service! My house has never been this clean. The team was professional, punctual, and very thorough. Highly recommended!' },
      { id: 2, name: 'Chamara Rodrigo', rating: 5, date: 'Feb 2026', text: 'Great attention to detail. They cleaned areas I didn\'t even think about. Will definitely use again.' },
      { id: 3, name: 'Dilini Silva', rating: 4, date: 'Feb 2026', text: 'Good service overall. The team was friendly and efficient. Would have liked slightly more attention to the kitchen area.' },
    ]
  };

  return (
    <div className="detail-page page-content">
      <div className="container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/">{t('service_detail.breadcrumb_home')}</Link>
          <ChevronRight size={14} />
          <Link to="/services">{t('service_detail.breadcrumb_services')}</Link>
          <ChevronRight size={14} />
          <span>{service.title}</span>
        </div>

        <div className="detail-layout">
          {/* Main Content */}
          <div className="detail-main">
            {/* Header Banner */}
            <motion.div
              className="detail-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="detail-banner-gradient" />
              <div className="detail-banner-content">
                <Badge variant="success" size="md">✓ {t('service_detail.verified_provider')}</Badge>
                <h1>{service.title}</h1>
                <div className="detail-banner-meta">
                  <Rating value={service.rating} count={service.reviewCount} size="md" />
                  <span className="detail-meta-sep">·</span>
                  <span><MapPin size={16} /> {service.location}</span>
                  <span className="detail-meta-sep">·</span>
                  <span><Clock size={16} /> {service.responseTime} {t('service_detail.response')}</span>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="detail-tabs">
              {['overview', 'packages', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(`service_detail.tab_${tab}`)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <motion.div className="detail-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3>{t('service_detail.about_service')}</h3>
                <p className="detail-description">{service.description}</p>
                <h4>{t('service_detail.whats_included')}</h4>
                <div className="detail-highlights">
                  {service.highlights.map((h, i) => (
                    <div key={i} className="detail-highlight">
                      <CheckCircle size={18} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'packages' && (
              <motion.div className="detail-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3>{t('service_detail.pricing_packages')}</h3>
                <div className="detail-packages">
                  {service.packages.map((pkg, i) => (
                    <div key={i} className={`detail-package ${i === 1 ? 'featured' : ''}`}>
                      {i === 1 && <Badge variant="primary" size="sm">{t('service_detail.most_popular')}</Badge>}
                      <h4>{pkg.name}</h4>
                      <div className="detail-package-price">
                        <span>LKR {pkg.price.toLocaleString()}</span>
                      </div>
                      <ul className="detail-package-features">
                        {pkg.features.map((f, j) => (
                          <li key={j}><CheckCircle size={16} /> {f}</li>
                        ))}
                      </ul>
                      <Button variant={i === 1 ? 'primary' : 'secondary'} fullWidth>{t('service_detail.select_package')}</Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div className="detail-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="detail-reviews-header">
                  <h3>{t('service_detail.reviews_count')} ({service.reviewCount})</h3>
                  <div className="detail-reviews-summary">
                    <span className="detail-reviews-avg">{service.rating}</span>
                    <Rating value={service.rating} size="md" showValue={false} />
                  </div>
                </div>
                <div className="detail-reviews-list">
                  {service.reviews.map(review => (
                    <div key={review.id} className="detail-review">
                      <div className="detail-review-author">
                        <Avatar name={review.name} size="md" />
                        <div>
                          <p className="detail-review-name">{review.name}</p>
                          <p className="detail-review-date">{review.date}</p>
                        </div>
                        <Rating value={review.rating} size="sm" className="detail-review-rating" />
                      </div>
                      <p className="detail-review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="detail-sidebar-card">
              <div className="detail-sidebar-provider">
                <Avatar name={service.providerName} size="xl" />
                <h4>{service.providerName}</h4>
                <p>{service.category} {t('service_detail.expert')}</p>
                <Rating value={service.rating} count={service.reviewCount} size="sm" />
              </div>
              <div className="detail-sidebar-stats">
                <div className="detail-sidebar-stat">
                  <span className="detail-sidebar-stat-val">{service.completedJobs}</span>
                  <span className="detail-sidebar-stat-label">{t('service_detail.jobs_done')}</span>
                </div>
                <div className="detail-sidebar-stat">
                  <span className="detail-sidebar-stat-val">{service.responseTime}</span>
                  <span className="detail-sidebar-stat-label">{t('service_detail.response_val')}</span>
                </div>
                <div className="detail-sidebar-stat">
                  <span className="detail-sidebar-stat-val">{service.memberSince}</span>
                  <span className="detail-sidebar-stat-label">{t('service_detail.member_since')}</span>
                </div>
              </div>
              <div className="detail-sidebar-price">
                <span className="detail-sidebar-price-label">{t('service_detail.starting_from')}</span>
                <span className="detail-sidebar-price-value">LKR {service.price.toLocaleString()}</span>
              </div>
              <div className="detail-sidebar-actions">
                <Link to={isAuthenticated ? '/chat' : '/login'} style={{ width: '100%' }}>
                  <Button variant="primary" size="lg" fullWidth icon={Calendar}>{t('service_detail.book_now')}</Button>
                </Link>
                <Link to={isAuthenticated ? '/chat' : '/login'} style={{ width: '100%' }}>
                  <Button variant="secondary" size="lg" fullWidth icon={MessageSquare}>{t('service_detail.message')}</Button>
                </Link>
              </div>
              <div className="detail-sidebar-footer">
                <button><Share2 size={16} /> {t('service_detail.share')}</button>
                <button><Heart size={16} /> {t('service_detail.save')}</button>
                <button><Flag size={16} /> {t('service_detail.report')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
