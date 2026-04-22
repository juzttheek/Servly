import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MapPin, DollarSign, Clock, ArrowRight, ArrowLeft, CheckCircle, Upload, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { SERVICE_CATEGORIES, LOCATIONS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import './PostRequest.css';

const PostRequest = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    budget: '',
    timeline: '',
    location: '',
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const totalSteps = 4;

  // Get selected category object
  const selectedCategoryObj = SERVICE_CATEGORIES.find(c => c.id === formData.category);

  const canNext = () => {
    if (step === 1) return !!formData.category;
    if (step === 2) return formData.title && formData.description;
    if (step === 3) return formData.budget && formData.location;
    return true;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // =========================================================================
    // MULTI-LANGUAGE DATABASE PREPARATION
    // In production, you would either:
    // 1. Let the frontend send the strings to a Firebase Cloud Function, 
    //    which auto-translates and saves the {en, si, ta} object.
    // 2. OR structure it here using an auto-translate API before saving.
    // Here is how we format the user's string data into our new UGC schema:
    // =========================================================================
    const requestPayload = {
      category: formData.category,
      subcategory: formData.subcategory,
      title: {
        en: formData.title,
        si: `${formData.title} (Sinhala Translation)`, // Would come from Translation API
        ta: `${formData.title} (Tamil Translation)`   // Would come from Translation API
      },
      description: {
        en: formData.description,
        si: `${formData.description} (Sinhala Translation)`,
        ta: `${formData.description} (Tamil Translation)`
      },
      budget: formData.budget,
      timeline: formData.timeline,
      location: formData.location,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    console.log("Saving to Firebase Database:", requestPayload);
    
    // Example Firestore call: 
    // await addDocument('requests', requestPayload);

    alert(t('post_request.success_msg'));
    navigate('/dashboard');
  };

  return (
    <div className="post-page page-content">
      <div className="container">
        <motion.div className="post-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="post-header">
            <h1>{t('post_request.page_title')}</h1>
            <p>{t('post_request.page_desc')}</p>
          </div>

          {/* Progress */}
          <div className="post-progress">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`post-progress-step ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                <div className="post-progress-dot">
                  {step > s ? <CheckCircle size={18} /> : s}
                </div>
                <span className="post-progress-label">
                  {s === 1 && t('post_request.step_category')}
                  {s === 2 && t('post_request.step_details')}
                  {s === 3 && t('post_request.step_budget')}
                  {s === 4 && t('post_request.step_review')}
                </span>
              </div>
            ))}
            <div className="post-progress-bar">
              <div className="post-progress-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
            </div>
          </div>

          {/* Step 1: Category */}
          {step === 1 && (
            <motion.div className="post-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>{t('post_request.select_category')}</h3>
              <p className="post-step-desc">{t('post_request.choose_type')}</p>
              <div className="post-categories">
                {SERVICE_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  // Dynamic translation for categories based on language
                  const categoryName = t(`landing.category_${cat.id.replace(/-/g, '_')}_name`, { defaultValue: cat.name });
                  
                  return (
                    <button
                      key={cat.id}
                      className={`post-category ${formData.category === cat.id ? 'active' : ''} ${cat.featured ? 'post-category-featured' : ''}`}
                      onClick={() => {
                        updateField('category', cat.id);
                        updateField('subcategory', '');
                      }}
                    >
                      <div className="post-category-icon" style={{ color: cat.color, background: `${cat.color}12` }}>
                        <Icon size={24} />
                      </div>
                      <span>{cat.emoji} {categoryName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Subcategory selection when a category is picked */}
              {selectedCategoryObj && (
                <motion.div
                  className="post-subcategories"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4>{t('post_request.select_sub')}</h4>
                  <div className="post-subcategory-list">
                    <button
                      className={`post-subcategory ${!formData.subcategory ? 'active' : ''}`}
                      onClick={() => updateField('subcategory', '')}
                    >
                      {t('post_request.all_prefix')} {t(`landing.category_${selectedCategoryObj.id.replace(/-/g, '_')}_name`, { defaultValue: selectedCategoryObj.name })}
                    </button>
                    {selectedCategoryObj.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        className={`post-subcategory ${formData.subcategory === sub.id ? 'active' : ''}`}
                        onClick={() => updateField('subcategory', sub.id)}
                      >
                        {/* If we had translations for subcategories, we'd use them here */}
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div className="post-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>{t('post_request.describe_request')}</h3>
              <p className="post-step-desc">{t('post_request.be_specific')}</p>
              <div className="post-form">
                <Input label={t('post_request.title_label')} icon={FileText} placeholder={t('post_request.title_placeholder')} value={formData.title} onChange={e => updateField('title', e.target.value)} />
                <Input label={t('post_request.desc_label')} type="textarea" placeholder={t('post_request.desc_placeholder')} value={formData.description} onChange={e => updateField('description', e.target.value)} />
                <div className="post-upload-area">
                  <Upload size={24} />
                  <p>{t('post_request.drag_drop')} <span>{t('post_request.browse')}</span></p>
                  <p className="post-upload-hint">{t('post_request.max_images')}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <motion.div className="post-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>{t('post_request.set_budget')}</h3>
              <p className="post-step-desc">{t('post_request.help_providers')}</p>
              <div className="post-form">
                <Input label={t('post_request.budget_label')} icon={DollarSign} type="number" placeholder={t('post_request.budget_placeholder')} value={formData.budget} onChange={e => updateField('budget', e.target.value)} />
                <div className="post-form-group">
                  <label className="input-label">{t('post_request.timeline_label')}</label>
                  <select className="post-select" value={formData.timeline} onChange={e => updateField('timeline', e.target.value)}>
                    <option value="">{t('post_request.select_timeline')}</option>
                    <option value="urgent">{t('post_request.urgent')}</option>
                    <option value="this-week">{t('post_request.this_week')}</option>
                    <option value="this-month">{t('post_request.this_month')}</option>
                    <option value="flexible">{t('post_request.flexible')}</option>
                  </select>
                </div>
                <div className="post-form-group">
                  <label className="input-label">{t('post_request.location_label')}</label>
                  <select className="post-select" value={formData.location} onChange={e => updateField('location', e.target.value)}>
                    <option value="">{t('post_request.select_location')}</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div className="post-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>{t('post_request.review_request')}</h3>
              <p className="post-step-desc">{t('post_request.double_check')}</p>
              <div className="post-review">
                <div className="post-review-item">
                  <span className="post-review-label">{t('post_request.step_category')}</span>
                  <span className="post-review-value">
                    {selectedCategoryObj ? `${selectedCategoryObj.emoji} ${t(`landing.category_${selectedCategoryObj.id.replace(/-/g, '_')}_name`, { defaultValue: selectedCategoryObj.name })}` : '—'}
                  </span>
                </div>
                {formData.subcategory && (
                  <div className="post-review-item">
                    <span className="post-review-label">{t('post_request.sub_service')}</span>
                    <span className="post-review-value">
                      {selectedCategoryObj?.subcategories.find(s => s.id === formData.subcategory)?.name || '—'}
                    </span>
                  </div>
                )}
                <div className="post-review-item">
                  <span className="post-review-label">{t('post_request.title_label')}</span>
                  <span className="post-review-value">{formData.title || '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">{t('post_request.desc_label')}</span>
                  <span className="post-review-value">{formData.description || '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">{t('post_request.step_budget')}</span>
                  <span className="post-review-value">{formData.budget ? `LKR ${Number(formData.budget).toLocaleString()}` : '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">{t('post_request.timeline_label')}</span>
                  <span className="post-review-value">{formData.timeline ? t(`post_request.${formData.timeline.replace('-', '_')}`, { defaultValue: formData.timeline }) : '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">{t('post_request.location_label')}</span>
                  <span className="post-review-value">{formData.location || '—'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="post-nav">
            {step > 1 && (
              <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(s => s - 1)}>{t('post_request.btn_back')}</Button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps ? (
              <Button variant="primary" icon={ArrowRight} iconPosition="right" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>{t('post_request.btn_continue')}</Button>
            ) : (
              <Button variant="primary" icon={CheckCircle} iconPosition="right" onClick={handleSubmit}>{t('post_request.btn_post')}</Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostRequest;
