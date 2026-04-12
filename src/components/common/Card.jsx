import './Card.css';

const Card = ({
  children,
  variant = 'default',
  hover = true,
  padding = 'md',
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    `card-p-${padding}`,
    hover && 'card-hover',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, height = '200px', className = '' }) => (
  <div className={`card-image ${className}`} style={{ height }}>
    <img src={src} alt={alt} />
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

export default Card;
