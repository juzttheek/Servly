import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search, ArrowRight, CheckCircle, Star, Shield, Zap,
  Users, Clock, MapPin, Play, ChevronRight, Sparkles,
  TrendingUp, Award, HeartHandshake
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
  const statsRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
                <Sparkles size={14} /> {t('landing.hero_badge')}
              </Badge>
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp}>
              {t('landing.hero_title_1')}
              <br />
              <span className="hero-title-highlight">{t('landing.hero_title_highlight')}</span>
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              {t('landing.hero_subtitle')}
            </motion.p>

            <motion.form className="hero-search" variants={fadeUp} onSubmit={handleSearch}>
              <div className="hero-search-bar">
                <Search size={22} className="hero-search-icon" />
                <input
                  type="text"
                  placeholder={t('landing.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero-search-input"
                />
                <Button type="submit" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  {t('landing.search_button')}
                </Button>
              </div>
              <div className="hero-search-tags">
                <span className="hero-search-tags-label">{t('landing.popular')}</span>
                {['Home Cleaning', 'Plumbing', 'Photography', 'Web Development'].map(tag => (
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
                <p>{t('landing.trusted_by')} <strong>10,000+</strong> {t('landing.customers')}</p>
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
                  <p className="hero-fc-title">{t('landing.verified_providers')}</p>
                  <p className="hero-fc-desc">{t('landing.verified_desc')}</p>
                </div>
              </div>
              <div className="hero-floating-card hero-fc-2">
                <div className="hero-fc-icon hero-fc-icon-blue"><Zap size={20} /></div>
                <div>
                  <p className="hero-fc-title">{t('landing.fast_matching')}</p>
                  <p className="hero-fc-desc">{t('landing.fast_desc')}</p>
                </div>
              </div>
              <div className="hero-floating-card hero-fc-3">
                <div className="hero-fc-icon hero-fc-icon-green"><Star size={20} /></div>
                <div>
                  <p className="hero-fc-title">{t('landing.avg_rating')}</p>
                  <p className="hero-fc-desc">{t('landing.reviews')}</p>
                </div>
              </div>

              <div className="hero-main-visual">
                <div className="hero-visual-gradient" />
                <div className="hero-visual-content">
                  <HeartHandshake size={64} strokeWidth={1.5} />
                  <h3>{t('landing.smart_marketplace')}</h3>
                  <p>{t('landing.connecting_people')}</p>
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
            <Badge variant="primary" size="lg">{t('landing.categories_badge')}</Badge>
            <h2>{t('landing.categories_title')}</h2>
            <p className="section-desc">
              {t('landing.categories_desc')}
            </p>
          </motion.div>

          <div className="categories-grid">
            {SERVICE_CATEGORIES.map((cat, i) => {
              const IconComponent = cat.icon;
              // Clean key id: e.g. "home-cleaning" -> "home_cleaning"
              const transKey = cat.id.replace(/-/g, '_');
              return (
                <motion.div
                  key={cat.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Link to={`/services?category=${cat.id}`} className="category-card">
                    <div className="category-icon" style={{ background: `${cat.color}12`, color: cat.color }}>
                      <IconComponent size={26} />
                    </div>
                    <h4 className="category-name">{t(`landing.category_${transKey}_name`)}</h4>
                    <p className="category-desc">{t(`landing.category_${transKey}_desc`)}</p>
                    <span className="category-count">{cat.count} {t('landing.providers_count')}</span>
                    <div className="category-arrow"><ChevronRight size={18} /></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
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
            <Badge variant="primary" size="lg">{t('landing.how_badge')}</Badge>
            <h2>{t('landing.how_title')}</h2>
            <p className="section-desc">
              {t('landing.how_desc')}
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
                <h3 className="how-step-title">{t(`landing.how_step${step.step}_title`)}</h3>
                <p className="how-step-desc">{t(`landing.how_step${step.step}_desc`)}</p>
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
                <Badge variant="primary" size="lg">{t('landing.why_badge')}</Badge>
              </motion.div>
              <motion.h2 variants={fadeUp}>
                {t('landing.why_title')}
              </motion.h2>
              <motion.p className="why-desc" variants={fadeUp}>
                {t('landing.why_desc')}
              </motion.p>

              <div className="why-features">
                {[
                  { icon: Shield, titleKey: 'why_feat1_title', descKey: 'why_feat1_desc' },
                  { icon: Zap, titleKey: 'why_feat2_title', descKey: 'why_feat2_desc' },
                  { icon: Award, titleKey: 'why_feat3_title', descKey: 'why_feat3_desc' },
                  { icon: TrendingUp, titleKey: 'why_feat4_title', descKey: 'why_feat4_desc' }
                ].map((feature, i) => (
                  <motion.div key={i} className="why-feature" variants={fadeUp} custom={i + 3}>
                    <div className="why-feature-icon">
                      <feature.icon size={22} />
                    </div>
                    <div>
                      <h4 className="why-feature-title">{t(`landing.${feature.titleKey}`)}</h4>
                      <p className="why-feature-desc">{t(`landing.${feature.descKey}`)}</p>
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
                      <span className="why-stat-circle-label">{t('landing.why_stat_satisfied')}</span>
                    </div>
                  </div>
                  <div className="why-mini-stats">
                    <div className="why-mini-stat">
                      <span className="why-mini-value">2.5K+</span>
                      <span className="why-mini-label">{t('landing.why_stat_providers')}</span>
                    </div>
                    <div className="why-mini-stat">
                      <span className="why-mini-value">15K+</span>
                      <span className="why-mini-label">{t('landing.why_stat_jobs')}</span>
                    </div>
                    <div className="why-mini-stat">
                      <span className="why-mini-value">4.9★</span>
                      <span className="why-mini-label">{t('landing.why_stat_rating')}</span>
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
            <Badge variant="primary" size="lg">{t('landing.testimonials_badge')}</Badge>
            <h2>{t('landing.testimonials_title')}</h2>
            <p className="section-desc">
              {t('landing.testimonials_desc')}
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{t(`landing.testimonials_text${testimonial.id}`)}"</p>
                  <div className="testimonial-author">
                    <Avatar name={testimonial.name} size="md" />
                    <div>
                      <p className="testimonial-name">{testimonial.name}</p>
                      <p className="testimonial-role">{t(`landing.testimonials_role${testimonial.id}`)}</p>
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
              {t('landing.cta_title')}
            </motion.h2>
            <motion.p variants={fadeUp}>
              {t('landing.cta_desc')}
            </motion.p>
            <motion.div className="cta-buttons" variants={fadeUp}>
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  {t('landing.cta_primary_btn')}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  {t('landing.cta_secondary_btn')}
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
