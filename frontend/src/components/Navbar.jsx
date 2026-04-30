import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, User, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FolderKanban size={24} color="var(--accent-color)" />
        TeamTasker
      </Link>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <LayoutDashboard size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Dashboard
        </Link>
        <Link to="/projects" className={`nav-link ${isActive('/projects')}`}>
          <FolderKanban size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Projects
        </Link>
        
        <div className="profile-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <User size={16} />
            <div className="profile-info">
              <span className="profile-name">{user?.name}</span>
              <span className="profile-email">{user?.email}</span>
            </div>
            <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>
          </div>
          <Link to="/profile" className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Profile Settings">
            <Settings size={16} />
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
