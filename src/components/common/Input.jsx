import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  icon: Icon,
  error,
  helperText,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`input-group ${fullWidth ? 'input-full' : ''} ${error ? 'input-error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon">
            <Icon size={18} />
          </span>
        )}
        {type === 'textarea' ? (
          <textarea
            className={`input-field input-textarea ${Icon ? 'has-icon' : ''}`}
            {...props}
          />
        ) : (
          <input
            type={inputType}
            className={`input-field ${Icon ? 'has-icon' : ''} ${isPassword ? 'has-toggle' : ''}`}
            {...props}
          />
        )}
        {isPassword && (
          <button
            type="button"
            className="input-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
