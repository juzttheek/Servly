import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="btn-spinner">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="10" />
          </svg>
        </span>
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && !loading && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
    </button>
  );
};

export default Button;
