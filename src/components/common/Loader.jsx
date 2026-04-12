import './Loader.css';

export const Spinner = ({ size = 40, color = 'var(--color-brand-blue)' }) => (
  <div className="spinner" style={{ width: size, height: size }}>
    <svg viewBox="0 0 50 50">
      <circle
        cx="25" cy="25" r="20"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="80, 200"
        strokeDashoffset="0"
      />
    </svg>
  </div>
);

export const PageLoader = () => (
  <div className="page-loader">
    <div className="page-loader-content">
      <div className="page-loader-logo">S</div>
      <Spinner size={48} />
      <p className="page-loader-text">Loading...</p>
    </div>
  </div>
);

export const SkeletonLine = ({ width = '100%', height = '16px' }) => (
  <div className="skeleton" style={{ width, height }} />
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
    <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ height: '14px', width: '40%' }} />
      <div className="skeleton" style={{ height: '20px', width: '80%' }} />
      <div className="skeleton" style={{ height: '14px', width: '60%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <div className="skeleton" style={{ height: '16px', width: '30%' }} />
        <div className="skeleton" style={{ height: '36px', width: '100px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    </div>
  </div>
);

const Loader = PageLoader;
export default Loader;
