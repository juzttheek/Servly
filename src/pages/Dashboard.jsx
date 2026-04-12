import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Plus, Clock, CheckCircle, XCircle, TrendingUp,
  Star, MessageSquare, MapPin, Calendar, ArrowRight,
  Briefcase, Users, DollarSign, BarChart3, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Rating from '../components/common/Rating';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userProfile, isProvider } = useAuth();
  const displayName = currentUser?.displayName?.split(' ')[0] || 'User';

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    })
  };

  // Demo data
  const recentBookings = [
    { id: 1, title: 'Home Cleaning Service', provider: 'Ashan M.', status: 'confirmed', date: 'Apr 15, 2026', price: 'LKR 3,500' },
    { id: 2, title: 'Plumbing Repair', provider: 'Kamal D.', status: 'in-progress', date: 'Apr 12, 2026', price: 'LKR 2,000' },
    { id: 3, title: 'Electrical Wiring', provider: 'Nimal P.', status: 'completed', date: 'Apr 8, 2026', price: 'LKR 5,500' },
  ];

  const recommendations = [
    { id: 1, title: 'Professional Photography', provider: 'Saman K.', rating: 4.9, reviews: 128, price: 'From LKR 5,000', category: 'Photography' },
    { id: 2, title: 'Garden Maintenance', provider: 'Ravi J.', rating: 4.8, reviews: 76, price: 'From LKR 2,500', category: 'Gardening' },
    { id: 3, title: 'Web Development', provider: 'Dilshan F.', rating: 5.0, reviews: 234, price: 'From LKR 15,000', category: 'Web Dev' },
  ];

  const providerStats = [
    { icon: DollarSign, label: 'Total Earnings', value: 'LKR 45,000', trend: '+12%', color: '#22C55E' },
    { icon: Briefcase, label: 'Active Jobs', value: '3', trend: '', color: '#2359C8' },
    { icon: Users, label: 'Total Clients', value: '28', trend: '+5', color: '#3B80E8' },
    { icon: Star, label: 'Rating', value: '4.9', trend: '', color: '#F59E0B' },
  ];

  const incomingRequests = [
    { id: 1, customer: 'Nadeesha P.', title: 'Kitchen plumbing fix', budget: 'LKR 3,000', date: '2 hours ago', location: 'Colombo 07' },
    { id: 2, customer: 'Chamara R.', title: 'Bathroom leak repair', budget: 'LKR 2,500', date: '5 hours ago', location: 'Gampaha' },
  ];

  const statusColors = {
    pending: 'warning',
    confirmed: 'primary',
    'in-progress': 'info',
    completed: 'success',
    cancelled: 'error'
  };

  return (
    <div className="dashboard-page page-content">
      <div className="container">
        {/* Welcome Header */}
        <motion.div className="dash-header" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="dash-welcome">
            <h1>Welcome back, {displayName}! 👋</h1>
            <p>{isProvider ? 'Manage your services and track your earnings.' : 'Find services, track bookings, and manage your requests.'}</p>
          </div>
          <div className="dash-header-actions">
            {isProvider ? (
              <Link to="/post-request">
                <Button variant="primary" icon={Plus}>New Service</Button>
              </Link>
            ) : (
              <Link to="/post-request">
                <Button variant="primary" icon={Plus}>Post Request</Button>
              </Link>
            )}
          </div>
        </motion.div>

        {isProvider ? (
          /* ===== PROVIDER DASHBOARD ===== */
          <>
            {/* Stats Cards */}
            <div className="dash-stats-grid">
              {providerStats.map((stat, i) => (
                <motion.div key={i} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}>
                  <Card variant="default" padding="md" hover={false}>
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon" style={{ background: `${stat.color}14`, color: stat.color }}>
                        <stat.icon size={22} />
                      </div>
                      <div className="dash-stat-info">
                        <span className="dash-stat-label">{stat.label}</span>
                        <span className="dash-stat-value">{stat.value}</span>
                      </div>
                      {stat.trend && (
                        <Badge variant="success" size="sm">{stat.trend}</Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Incoming Requests */}
            <motion.div className="dash-section" initial="hidden" animate="visible" custom={5} variants={fadeUp}>
              <div className="dash-section-header">
                <h3>Incoming Requests</h3>
                <Link to="/services" className="dash-section-link">View All <ArrowRight size={16} /></Link>
              </div>
              <div className="dash-requests-list">
                {incomingRequests.map(req => (
                  <Card key={req.id} variant="default" padding="md">
                    <div className="dash-request-item">
                      <Avatar name={req.customer} size="md" />
                      <div className="dash-request-info">
                        <h4>{req.title}</h4>
                        <div className="dash-request-meta">
                          <span><MapPin size={14} /> {req.location}</span>
                          <span><Clock size={14} /> {req.date}</span>
                        </div>
                      </div>
                      <div className="dash-request-budget">{req.budget}</div>
                      <div className="dash-request-actions">
                        <Button variant="primary" size="sm">Accept</Button>
                        <Button variant="ghost" size="sm">Decline</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* ===== CUSTOMER DASHBOARD ===== */
          <>
            {/* Quick Actions */}
            <div className="dash-quick-actions">
              {[
                { icon: Search, label: 'Browse Services', to: '/services', color: '#2359C8' },
                { icon: Plus, label: 'Post Request', to: '/post-request', color: '#3B80E8' },
                { icon: MessageSquare, label: 'Messages', to: '/chat', color: '#22C55E' },
                { icon: Calendar, label: 'My Bookings', to: '/dashboard', color: '#F59E0B' },
              ].map((action, i) => (
                <motion.div key={i} initial="hidden" animate="visible" custom={i + 1} variants={fadeUp}>
                  <Link to={action.to} className="dash-quick-action">
                    <div className="dash-qa-icon" style={{ background: `${action.color}14`, color: action.color }}>
                      <action.icon size={24} />
                    </div>
                    <span>{action.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Recent Bookings */}
            <motion.div className="dash-section" initial="hidden" animate="visible" custom={5} variants={fadeUp}>
              <div className="dash-section-header">
                <h3>Recent Bookings</h3>
                <Link to="/dashboard" className="dash-section-link">View All <ArrowRight size={16} /></Link>
              </div>
              <div className="dash-bookings-list">
                {recentBookings.map(booking => (
                  <Card key={booking.id} variant="default" padding="none">
                    <div className="dash-booking-item">
                      <div className="dash-booking-info">
                        <h4>{booking.title}</h4>
                        <p>by {booking.provider} · {booking.date}</p>
                      </div>
                      <Badge variant={statusColors[booking.status]} size="md">
                        {booking.status.replace('-', ' ')}
                      </Badge>
                      <span className="dash-booking-price">{booking.price}</span>
                      <Button variant="ghost" size="sm" icon={Eye}>View</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Recommended */}
            <motion.div className="dash-section" initial="hidden" animate="visible" custom={7} variants={fadeUp}>
              <div className="dash-section-header">
                <h3>Recommended for You</h3>
                <Link to="/services" className="dash-section-link">Browse All <ArrowRight size={16} /></Link>
              </div>
              <div className="dash-recommendations">
                {recommendations.map(service => (
                  <Card key={service.id} variant="default" padding="md" hover>
                    <div className="dash-rec-card">
                      <Badge variant="primary" size="sm">{service.category}</Badge>
                      <h4>{service.title}</h4>
                      <p className="dash-rec-provider">by {service.provider}</p>
                      <div className="dash-rec-footer">
                        <Rating value={service.rating} count={service.reviews} size="sm" />
                        <span className="dash-rec-price">{service.price}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
