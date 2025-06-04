import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Userheader() {
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);
      } catch (err) {
        console.error('Invalid token');
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'shadow-sm bg-white' : 'bg-white bg-opacity-90'}`} 
           style={{ 
             transition: 'all 0.3s ease-in-out',
             padding: '0.5rem 1rem',
             height: '70px',
             backdropFilter: 'blur(8px)',
             WebkitBackdropFilter: 'blur(8px)'
           }}>
        <div className="container">

          <NavLink to="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-music-note-beamed me-2" style={{ 
              color: '#e63946', 
              fontSize: '1.8rem',
              transition: 'transform 0.3s ease'
            }}></i>
            <span style={{ 
              color: '#1d3557', 
              fontWeight: 800, 
              fontSize: '1.6rem',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #e63946, #1d3557)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ConcertHub</span>
          </NavLink>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#navbarContent" aria-controls="navbarContent" 
                  aria-expanded="false" aria-label="Toggle navigation"
                  style={{ border: 'none' }}>
            <i className="bi bi-list" style={{ fontSize: '1.8rem', color: '#1d3557' }}></i>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarContent" style={{}}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <li className="nav-item me-1">
                <NavLink to="/" className={({isActive}) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active-nav-item' : ''}`}
                  style={{ 
                    fontWeight: 600,
                    padding: '0.5rem 1.2rem',
                    borderRadius: '50px',
                    transition: 'all 0.2s ease'
                  }}>
                  <i className="bi bi-music-player me-2"></i>Concerts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/showbookings" className={({isActive}) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active-nav-item' : ''}`}
                  style={{ 
                    fontWeight: 600,
                    padding: '0.5rem 1.2rem',
                    borderRadius: '50px',
                    transition: 'all 0.2s ease'
                  }}>
                  <i className="bi bi-ticket-perforated me-2"></i>Bookings
                </NavLink>
              </li>
            </ul>
            
            <div className="d-flex align-items-center ms-auto">
              <div className="dropdown">
                <button 
                  className="btn d-flex align-items-center" 
                  type="button" 
                  id="userDropdown"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{
                    border: "none",
                    background: "transparent",
                    transition: "all 0.3s ease",
                    padding: "0.2rem 0.8rem",
                    borderRadius: "50px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(230, 57, 70, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <i 
                    className="bi bi-person-circle fs-4 me-2" 
                    style={{
                      color: "#e63946",
                      transition: "transform 0.3s ease"
                    }}
                  ></i>
                  <span 
                    style={{
                      color: "#1d3557",
                      fontSize: "0.95rem",
                      fontWeight: "600"
                    }}
                  >
                    {userName || 'Account'}
                  </span>
                </button>
                <ul className="dropdown-menu shadow border-0 mt-3" 
                    aria-labelledby="userDropdown" 
                    style={{ 
                      borderRadius: '12px',
                      padding: '0.5rem 0',
                      minWidth: '200px',
                    }}>
                  {userName ? (
                    <>
                      <li>
                        <span className="dropdown-item d-flex align-items-center py-2 px-3" style={{ cursor: 'default' }}>
                          <i className="bi bi-person me-2 text-muted"></i>
                          <span className="text-muted">Signed in as</span>
                          <span className="ms-1 fw-bold text-truncate" style={{ color: '#1d3557' }}>{userName}</span>
                        </span>
                      </li>
                      <li><hr className="dropdown-divider my-1" /></li>
                      <li>
                        <NavLink className="dropdown-item d-flex align-items-center py-2 px-3" to="#">
                          <i className="bi bi-person me-2"></i>Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item d-flex align-items-center py-2 px-3 text-danger" to="/logout">
                          <i className="bi bi-box-arrow-right me-2"></i>Logout
                        </NavLink>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <NavLink className="dropdown-item d-flex align-items-center py-2 px-3" to="/authentication">
                          <i className="bi bi-box-arrow-in-right me-2"></i>Login
                        </NavLink>
                      </li>
                      {/* <li>
                        <NavLink className="dropdown-item d-flex align-items-center py-2 px-3" to="/authentication">
                          <i className="bi bi-person-plus me-2"></i>Register
                        </NavLink>
                      </li> */}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .active-nav-item {
          color: #e63946 !important;
          background-color: rgba(230, 57, 70, 0.1) !important;
        }
        .nav-link:hover {
          color: #e63946 !important;
          background-color: rgba(230, 57, 70, 0.05) !important;
        }
        .dropdown-item:hover {
          background-color: rgba(230, 57, 70, 0.1) !important;
          color: #e63946 !important;
        }
        .dropdown-item:active {
          background-color: rgba(230, 57, 70, 0.2) !important;
        }
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background-color: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 12px;
            margin-top: 10px;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          .dropdown-menu {
            background-color: rgba(255, 255, 255, 0.95) !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Userheader;