import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, MapPin, DollarSign, Clock, ArrowRight, ArrowLeft, CheckCircle, Upload, Image } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { SERVICE_CATEGORIES, LOCATIONS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import './PostRequest.css';

const PostRequest = () => {
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

  const handleSubmit = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Would save to Firestore here
    alert('Request posted successfully! (Demo)');
    navigate('/dashboard');
  };

  return (
    <div className="post-page page-content">
      <div className="container">
        <motion.div className="post-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="post-header">
            <h1>Post a Service Request</h1>
            <p>Tell us what you need and let providers come to you</p>
          </div>

          {/* Progress */}
          <div className="post-progress">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`post-progress-step ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                <div className="post-progress-dot">
                  {step > s ? <CheckCircle size={18} /> : s}
                </div>
                <span className="post-progress-label">
                  {s === 1 && 'Category'}
                  {s === 2 && 'Details'}
                  {s === 3 && 'Budget'}
                  {s === 4 && 'Review'}
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
              <h3>Select a Category</h3>
              <p className="post-step-desc">Choose the type of service you need</p>
              <div className="post-categories">
                {SERVICE_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
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
                      <span>{cat.emoji} {cat.name}</span>
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
                  <h4>Select a specific service (optional)</h4>
                  <div className="post-subcategory-list">
                    <button
                      className={`post-subcategory ${!formData.subcategory ? 'active' : ''}`}
                      onClick={() => updateField('subcategory', '')}
                    >
                      All {selectedCategoryObj.name}
                    </button>
                    {selectedCategoryObj.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        className={`post-subcategory ${formData.subcategory === sub.id ? 'active' : ''}`}
                        onClick={() => updateField('subcategory', sub.id)}
                      >
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
              <h3>Describe Your Request</h3>
              <p className="post-step-desc">Be specific to get the best responses</p>
              <div className="post-form">
                <Input label="Title" icon={FileText} placeholder="e.g., Need plumbing repair for leaky faucet" value={formData.title} onChange={e => updateField('title', e.target.value)} />
                <Input label="Description" type="textarea" placeholder="Describe the work needed, your requirements, and any specifics..." value={formData.description} onChange={e => updateField('description', e.target.value)} />
                <div className="post-upload-area">
                  <Upload size={24} />
                  <p>Drag & drop images or <span>browse</span></p>
                  <p className="post-upload-hint">Max 5 images, 5MB each</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <motion.div className="post-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>Set Budget & Location</h3>
              <p className="post-step-desc">Help providers understand your expectations</p>
              <div className="post-form">
                <Input label="Budget (LKR)" icon={DollarSign} type="number" placeholder="e.g., 5000" value={formData.budget} onChange={e => updateField('budget', e.target.value)} />
                <div className="post-form-group">
                  <label className="input-label">Timeline</label>
                  <select className="post-select" value={formData.timeline} onChange={e => updateField('timeline', e.target.value)}>
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (Today/Tomorrow)</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="post-form-group">
                  <label className="input-label">Location</label>
                  <select className="post-select" value={formData.location} onChange={e => updateField('location', e.target.value)}>
                    <option value="">Select location</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div className="post-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3>Review Your Request</h3>
              <p className="post-step-desc">Double-check everything before posting</p>
              <div className="post-review">
                <div className="post-review-item">
                  <span className="post-review-label">Category</span>
                  <span className="post-review-value">
                    {selectedCategoryObj ? `${selectedCategoryObj.emoji} ${selectedCategoryObj.name}` : '—'}
                  </span>
                </div>
                {formData.subcategory && (
                  <div className="post-review-item">
                    <span className="post-review-label">Sub-service</span>
                    <span className="post-review-value">
                      {selectedCategoryObj?.subcategories.find(s => s.id === formData.subcategory)?.name || '—'}
                    </span>
                  </div>
                )}
                <div className="post-review-item">
                  <span className="post-review-label">Title</span>
                  <span className="post-review-value">{formData.title || '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">Description</span>
                  <span className="post-review-value">{formData.description || '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">Budget</span>
                  <span className="post-review-value">{formData.budget ? `LKR ${Number(formData.budget).toLocaleString()}` : '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">Timeline</span>
                  <span className="post-review-value">{formData.timeline || '—'}</span>
                </div>
                <div className="post-review-item">
                  <span className="post-review-label">Location</span>
                  <span className="post-review-value">{formData.location || '—'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="post-nav">
            {step > 1 && (
              <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(s => s - 1)}>Back</Button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps ? (
              <Button variant="primary" icon={ArrowRight} iconPosition="right" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>Continue</Button>
            ) : (
              <Button variant="primary" icon={CheckCircle} iconPosition="right" onClick={handleSubmit}>Post Request</Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostRequest;
