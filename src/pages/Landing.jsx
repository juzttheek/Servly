import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, CheckCircle, Star, Shield, Zap,
  Users, Clock, MapPin, Play, ChevronRight, Sparkles,
  TrendingUp, Award, HeartHandshake, AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Rating from '../components/common/Rating';
import Badge from '../components/common/Badge';
import { SERVICE_CATEGORIES, HOW_IT_WORKS_STEPS, STATS, TESTIMONIALS } from '../utils/constants';
import { formatNumber } from '../utils/helpers';
import './Landing.css';

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [counters, setCounters] = useState(STATS.map(() => 0));
  const [statsVisible, setStatsVisible] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  // Animate stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  useEffect(() => {
    if (!statsVisible) return;
    STATS.forEach((stat, i) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCounters(prev => {
          const next = [...prev];
          next[i] = Math.floor(start);
          return next;
        });
      }, 16);
    });
  }, [statsVisible]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    })
  };

  // Show first 6 or all categories
  const visibleCategories = showAllCategories ? SERVICE_CATEGORIES : SERVICE_CATEGORIES.slice(0, 6);

  return (
    <div className="landing">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-pattern" />
        </div>

        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp}>
              <Badge variant="dark" size="lg" dot>
                <Sparkles size={14} /> Sri Lanka's First All-in-One Service Platform
              </Badge>
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp}>
              Find Trusted Experts
              <br />
              <span className="hero-title-highlight">For Every Service</span>
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              From home repairs to legal advice — everything on Servly.
              Connect with verified professionals across {SERVICE_CATEGORIES.length} service categories.
            </motion.p>

            <motion.form className="hero-search" variants={fadeUp} onSubmit={handleSearch}>
              <div className="hero-search-bar">
                <Search size={22} className="hero-search-icon" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero-search-input"
                />
                <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Search
                </Button>
              </div>
              <div className="hero-search-tags">
                <span className="hero-search-tags-label">Popular:</span>
                {['Home Services', 'Legal Advice', 'Quick Help', 'Web Development'].map(tag => (
                  <Link
                    key={tag}
                    to={`/services?q=${encodeURIComponent(tag)}`}
                    className="hero-search-tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.form>

            <motion.div className="hero-trust" variants={fadeUp}>
              <div className="hero-trust-avatars">
                {['A', 'B', 'C', 'D'].map((letter, i) => (
                  <div key={i} className="hero-trust-avatar" style={{ marginLeft: i > 0 ? '-12px' : '0' }}>
                    <Avatar name={`User ${letter}`} size="sm" />
                  </div>
                ))}
              </div>
              <div className="hero-trust-info">
                <div className="hero-trust-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                  <span>4.9</span>
                </div>
                <p>Trusted by <strong>10,000+</strong> customers</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-card-stack">
              <div className="hero-floating-card hero-fc-1">
                <div className="hero-fc-icon"><Shield size={20} /></div>
                <div>
                  <p className="hero-fc-title">Verified Providers</p>
                  <p className="hero-fc-desc">100% background checked</p>
                </div>
              </div>
              <div className="hero-floating-card hero-fc-2">
                <div className="hero-fc-icon hero-fc-icon-blue"><Zap size={20} /></div>
                <div>
                  <p className="hero-fc-title">Fast Matching</p>
                  <p className="hero-fc-desc">Under 5 minutes</p>
                </div>
              </div>
              <div className="hero-floating-card hero-fc-3">
                <div className="hero-fc-icon hero-fc-icon-red"><AlertTriangle size={20} /></div>
                <div>
                  <p className="hero-fc-title">Quick Help 🔥</p>
                  <p className="hero-fc-desc">On-demand services</p>
                </div>
              </div>

              <div className="hero-main-visual">
                <div className="hero-visual-gradient" />
                <div className="hero-visual-content">
                  <HeartHandshake size={64} strokeWidth={1.5} />
                  <h3>All-in-One<br/>Service Platform</h3>
                  <p>{SERVICE_CATEGORIES.length} Categories<br/>One Platform</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="hero-scroll-dot" />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="stats-bar" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item">
                <span className="stat-value">
                  {formatNumber(counters[i])}{stat.suffix}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section categories-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <Badge variant="primary" size="lg">Services</Badge>
            <h2>Explore Our Categories</h2>
            <p className="section-desc">
              From home repairs to legal advice — find the right professional for any task across {SERVICE_CATEGORIES.length} service categories.
            </p>
          </motion.div>

          <div className="categories-grid">
            {visibleCategories.map((cat, i) => {
              const IconComponent = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Link to={`/services?category=${cat.id}`} className={`category-card ${cat.featured ? 'category-card-featured' : ''}`}>
                    {cat.featured && <div className="category-featured-badge">🔥 Unique Feature</div>}
                    <div className="category-icon" style={{ background: `${cat.color}12`, color: cat.color }}>
                      <IconComponent size={26} />
                    </div>
                    <h4 className="category-name">{cat.emoji} {cat.name}</h4>
                    <p className="category-desc">{cat.description}</p>
                    <div className="category-subcategories">
                      {cat.subcategories.slice(0, 3).map(sub => (
                        <span key={sub.id} className="category-sub-tag">{sub.name}</span>
                      ))}
                      {cat.subcategories.length > 3 && (
                        <span className="category-sub-more">+{cat.subcategories.length - 3} more</span>
                      )}
                    </div>
                    <span className="category-count">{cat.count} providers</span>
                    <div className="category-arrow"><ChevronRight size={18} /></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {SERVICE_CATEGORIES.length > 6 && (
            <motion.div
              className="categories-toggle"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowAllCategories(!showAllCategories)}
                icon={showAllCategories ? null : ArrowRight}
                iconPosition="right"
              >
                {showAllCategories ? 'Show Less' : `View All ${SERVICE_CATEGORIES.length} Categories`}
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section how-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <Badge variant="primary" size="lg">How It Works</Badge>
            <h2>Simple Steps to Get Started</h2>
            <p className="section-desc">
              Getting the help you need has never been easier. Three simple steps and you're done.
            </p>
          </motion.div>

          <div className="how-steps">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                className="how-step"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="how-step-number">{step.step}</div>
                <div className="how-step-connector" />
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section why-section">
        <div className="container">
          <div className="why-grid">
            <motion.div
              className="why-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeUp}>
                <Badge variant="primary" size="lg">Why Servly</Badge>
              </motion.div>
              <motion.h2 variants={fadeUp}>
                The Smarter Way to Find Services
              </motion.h2>
              <motion.p className="why-desc" variants={fadeUp}>
                We combine technology with human expertise to give you the best experience in finding and booking services across all {SERVICE_CATEGORIES.length} categories.
              </motion.p>

              <div className="why-features">
                {[
                  { icon: Shield, title: 'Verified & Trusted', desc: 'Every provider is vetted and verified for your safety.' },
                  { icon: Zap, title: 'Lightning Fast', desc: 'Smart matching connects you with the right expert in minutes.' },
                  { icon: Award, title: 'Quality Guaranteed', desc: 'Ratings, reviews, and our quality standards ensure excellence.' },
                  { icon: TrendingUp, title: 'Best Pricing', desc: 'Compare quotes and get the best value for your money.' }
                ].map((feature, i) => (
                  <motion.div key={i} className="why-feature" variants={fadeUp} custom={i + 3}>
                    <div className="why-feature-icon">
                      <feature.icon size={22} />
                    </div>
                    <div>
                      <h4 className="why-feature-title">{feature.title}</h4>
                      <p className="why-feature-desc">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="why-visual"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="why-visual-card">
                <div className="why-visual-gradient" />
                <div className="why-visual-stats">
                  <div className="why-stat-circle">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#3B80E8" strokeWidth="8"
                        strokeDasharray="327" strokeDashoffset="33" strokeLinecap="round"
                        transform="rotate(-90 60 60)" />
                    </svg>
                    <div className="why-stat-circle-text">
                      <span className="why-stat-circle-value">98%</span>
                      <span className="why-stat-circle-label">Satisfied</span>
                    </div>
                  </div>
                  <div className="why-mini-stats">
                    <div className="why-mini-stat">
                      <span className="why-mini-value">2.5K+</span>
                      <span className="why-mini-label">Providers</span>
                    </div>
                    <div className="why-mini-stat">
                      <span className="why-mini-value">15K+</span>
                      <span className="why-mini-label">Jobs Done</span>
                    </div>
                    <div className="why-mini-stat">
                      <span className="why-mini-value">4.9★</span>
                      <span className="why-mini-label">Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <Badge variant="primary" size="lg">Testimonials</Badge>
            <h2>What Our Customers Say</h2>
            <p className="section-desc">
              Don't just take our word for it — hear from the people who've experienced Servly.
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <Avatar name={t.name} size="md" />
                    <div>
                      <p className="testimonial-name">{t.name}</p>
                      <p className="testimonial-role">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />
        </div>
        <div className="container">
          <motion.div
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2 variants={fadeUp}>
              Ready to Get Started?
            </motion.h2>
            <motion.p variants={fadeUp}>
              Join thousands of customers and service providers on Sri Lanka's first all-in-one service platform.
              From home repairs to legal advice — everything on Servly.
            </motion.p>
            <motion.div className="cta-buttons" variants={fadeUp}>
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  Browse Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
