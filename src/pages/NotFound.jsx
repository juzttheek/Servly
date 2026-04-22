import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="notfound-page page-content">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1>{t('not_found.title')}</h1>
        <p>{t('not_found.desc')}</p>
        <div className="notfound-actions">
          <Link to="/">
            <Button variant="primary" size="lg" icon={Home}>{t('not_found.btn_home')}</Button>
          </Link>
          <Link to="/services">
            <Button variant="secondary" size="lg">{t('not_found.btn_browse')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
