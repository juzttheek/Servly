// Format price with currency
export const formatPrice = (price, type = 'fixed') => {
  const formatted = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);

  switch (type) {
    case 'hourly':
      return `${formatted}/hr`;
    case 'starting':
      return `From ${formatted}`;
    default:
      return formatted;
  }
};

// Format date
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(timestamp);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate password strength
export const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: 'weak', label: 'Weak', color: '#EF4444' };
  if (strength <= 3) return { level: 'fair', label: 'Fair', color: '#F59E0B' };
  if (strength <= 4) return { level: 'good', label: 'Good', color: '#3B80E8' };
  return { level: 'strong', label: 'Strong', color: '#22C55E' };
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Generate star array for ratings
export const generateStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('full');
    } else if (i - rating < 1 && i - rating > 0) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
};

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Format large numbers (1000 → 1K, 1000000 → 1M)
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

// Generate a random color from brand palette
export const getBrandColor = (index) => {
  const colors = ['#1B3561', '#2359C8', '#3B80E8'];
  return colors[index % colors.length];
};
