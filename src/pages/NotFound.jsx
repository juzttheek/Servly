import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page page-content">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <Link to="/">
            <Button variant="primary" size="lg" icon={Home}>Go Home</Button>
          </Link>
          <Link to="/services">
            <Button variant="secondary" size="lg">Browse Services</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
