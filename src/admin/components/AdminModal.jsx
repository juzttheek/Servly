import { X } from 'lucide-react';
import Button from '../../components/common/Button';
import '../styles/AdminModal.css';

const AdminModal = ({
  isOpen,
  title,
  children,
  onClose,
  actions = null,
  size = 'md'
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="admin-modal-overlay" onClick={onClose} />
      <div className={`admin-modal admin-modal-${size}`}>
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="admin-modal-content">
          {children}
        </div>

        {actions && (
          <div className="admin-modal-footer">
            {actions}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminModal;
