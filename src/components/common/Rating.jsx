import { Star, StarHalf } from 'lucide-react';
import { generateStars } from '../../utils/helpers';
import './Rating.css';

const Rating = ({ value = 0, count, size = 'sm', showValue = true, className = '' }) => {
  const stars = generateStars(value);
  const starSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;

  return (
    <div className={`rating rating-${size} ${className}`}>
      <div className="rating-stars">
        {stars.map((type, i) => (
          <span key={i} className={`rating-star rating-star-${type}`}>
            {type === 'half' ? (
              <StarHalf size={starSize} />
            ) : (
              <Star size={starSize} />
            )}
          </span>
        ))}
      </div>
      {showValue && <span className="rating-value">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="rating-count">({count})</span>}
    </div>
  );
};

export default Rating;
