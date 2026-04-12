import { getInitials } from '../../utils/helpers';
import './Avatar.css';

const Avatar = ({ src, name, size = 'md', status, className = '' }) => {
  const sizeMap = { xs: 28, sm: 36, md: 44, lg: 56, xl: 72, '2xl': 96 };
  const fontSize = { xs: '10px', sm: '12px', md: '14px', lg: '18px', xl: '22px', '2xl': '28px' };

  return (
    <div className={`avatar avatar-${size} ${className}`}>
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="avatar-img" />
      ) : (
        <div
          className="avatar-fallback"
          style={{ fontSize: fontSize[size] }}
        >
          {getInitials(name)}
        </div>
      )}
      {status && <span className={`avatar-status avatar-status-${status}`} />}
    </div>
  );
};

export default Avatar;
