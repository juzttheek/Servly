import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Camera, Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: userProfile?.phone || '',
    location: userProfile?.location || '',
    bio: userProfile?.bio || '',
  });

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved! (Demo)');
    }, 1000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="settings-page page-content">
      <div className="container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-layout">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <div className="settings-nav-divider" />
            <button className="settings-nav-btn settings-nav-danger" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </nav>

          <div className="settings-content">
            {activeTab === 'profile' && (
              <Card variant="default" padding="lg" hover={false}>
                <h3 className="settings-section-title">Profile Information</h3>
                <p className="settings-section-desc">Update your profile details that are visible to other users.</p>

                <div className="settings-avatar-section">
                  <Avatar name={currentUser?.displayName || 'User'} src={currentUser?.photoURL} size="xl" />
                  <div>
                    <Button variant="secondary" size="sm" icon={Camera}>Change Photo</Button>
                    <p className="settings-avatar-hint">JPG, PNG. Max 5MB.</p>
                  </div>
                </div>

                <div className="settings-form">
                  <Input label="Full Name" icon={User} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  <Input label="Email Address" icon={Mail} type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} disabled />
                  <div className="settings-form-row">
                    <Input label="Phone Number" icon={Phone} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+94 XX XXX XXXX" />
                    <Input label="Location" icon={MapPin} value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} placeholder="e.g., Colombo" />
                  </div>
                  <Input label="Bio" type="textarea" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself..." />
                </div>

                <div className="settings-actions">
                  <Button variant="primary" loading={saving} onClick={handleSave}>Save Changes</Button>
                  <Button variant="ghost">Cancel</Button>
                </div>
              </Card>
            )}

            {activeTab === 'account' && (
              <Card variant="default" padding="lg" hover={false}>
                <h3 className="settings-section-title">Account & Security</h3>
                <p className="settings-section-desc">Manage your password and account security.</p>
                <div className="settings-form">
                  <Input label="Current Password" icon={Lock} type="password" placeholder="Enter current password" />
                  <div className="settings-form-row">
                    <Input label="New Password" icon={Lock} type="password" placeholder="Enter new password" />
                    <Input label="Confirm Password" icon={Lock} type="password" placeholder="Confirm new password" />
                  </div>
                </div>
                <div className="settings-actions">
                  <Button variant="primary">Update Password</Button>
                </div>

                <div className="settings-divider" />
                <h3 className="settings-section-title settings-danger-title">Danger Zone</h3>
                <p className="settings-section-desc">Once you delete your account, there is no going back.</p>
                <Button variant="danger" size="sm">Delete Account</Button>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card variant="default" padding="lg" hover={false}>
                <h3 className="settings-section-title">Notification Preferences</h3>
                <p className="settings-section-desc">Choose how and when you'd like to be notified.</p>
                <div className="settings-toggles">
                  {[
                    { label: 'New messages', desc: 'When someone sends you a message', default: true },
                    { label: 'Booking updates', desc: 'Status changes on your bookings', default: true },
                    { label: 'New reviews', desc: 'When someone leaves a review', default: true },
                    { label: 'Promotional emails', desc: 'Deals, offers, and platform news', default: false },
                    { label: 'Service recommendations', desc: 'Personalized service suggestions', default: false },
                  ].map((item, i) => (
                    <label key={i} className="settings-toggle">
                      <div>
                        <span className="settings-toggle-label">{item.label}</span>
                        <span className="settings-toggle-desc">{item.desc}</span>
                      </div>
                      <input type="checkbox" defaultChecked={item.default} />
                    </label>
                  ))}
                </div>
                <div className="settings-actions">
                  <Button variant="primary" onClick={handleSave}>Save Preferences</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
