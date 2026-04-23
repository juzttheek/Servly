import '../styles/StatCard.css';

const StatCard = ({ icon: Icon, label, value, badge = null, variant = 'default' }) => {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-icon">
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-card-content">
        <p className="stat-card-label">{label}</p>
        <h3 className="stat-card-value">{value}</h3>
      </div>
      {badge && (
        <div className={`stat-card-badge badge-${badge.variant}`}>
          {badge.text}
        </div>
      )}
    </div>
  );
};

export default StatCard;
