import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Userheader() {
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState('');
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    setIsHomePage(window.location.pathname === '/');
    
    const handleScroll = () => {
      const scrollThreshold = window.location.pathname === '/' ? window.innerHeight : 50;
      setScrolled(window.scrollY > scrollThreshold);
    };
    
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

  const getNavbarBackground = () => {
    if (isHomePage) {
      return scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent';
    } else {
      return scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)';
    }
  };

  const getTextStyle = () => ({
    color: isHomePage && !scrolled ? '#ffffff' : '#1d3557',
    textShadow: isHomePage && !scrolled ? '0 2px 4px rgba(0,0,0,0.7)' : '0 1px 2px rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease-in-out'
  });

  const getBrandIconStyle = () => ({
    color: isHomePage && !scrolled ? '#ffffff' : '#e63946',
    fontSize: '1.8rem',
    transition: 'all 0.3s ease',
    filter: isHomePage && !scrolled ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
  });

  const getBrandTextStyle = () => ({
    color: isHomePage && !scrolled ? '#ffffff' : '#1d3557',
    fontWeight: 800,
    fontSize: '1.6rem',
    letterSpacing: '-0.5px',
    textShadow: isHomePage && !scrolled ? '0 2px 4px rgba(0,0,0,0.8)' : 'none',
    transition: 'all 0.3s ease-in-out'
  });

  return (
    <header>
      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'shadow-sm' : ''}`} 
           style={{ 
             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
             padding: '0.5rem 1rem',
             height: '70px',
             backgroundColor: getNavbarBackground(),
             backdropFilter: scrolled || !isHomePage ? 'blur(12px)' : 'none',
             WebkitBackdropFilter: scrolled || !isHomePage ? 'blur(12px)' : 'none',
             borderBottom: scrolled ? '1px solid rgba(230, 57, 70, 0.1)' : 'none'
           }}>
        <div className="container">

          <NavLink to="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-music-note-beamed me-2" style={getBrandIconStyle()}></i>
            <span style={getBrandTextStyle()}>ConcertHub</span>
          </NavLink>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#navbarContent" aria-controls="navbarContent" 
                  aria-expanded="false" aria-label="Toggle navigation"
                  style={{ 
                    border: 'none',
                    backgroundColor: isHomePage && !scrolled 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(29, 53, 87, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}>
            <i className="bi bi-list" style={{ 
              fontSize: '1.8rem', 
              color: isHomePage && !scrolled ? '#ffffff' : '#1d3557',
              filter: isHomePage && !scrolled ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' : 'none',
              transition: 'all 0.3s ease'
            }}></i>
          </button>
          
          <div className={`collapse navbar-collapse ${isHomePage && !scrolled ? 'dark-collapse' : ''}`} id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
              <li className="nav-item me-1">
                <NavLink to="/" className={({isActive}) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active-nav-item' : ''}`}
                  style={{ 
                    fontWeight: 600,
                    padding: '0.5rem 1.2rem',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease',
                    color: isHomePage && !scrolled ? '#ffffff' : '#1d3557',
                    textShadow: isHomePage && !scrolled ? '0 2px 4px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)'
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
                    transition: 'all 0.3s ease',
                    color: isHomePage && !scrolled ? '#ffffff' : '#1d3557',
                    textShadow: isHomePage && !scrolled ? '0 2px 4px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)'
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
                    background: isHomePage && !scrolled 
                      ? "rgba(255, 255, 255, 0.15)" 
                      : "rgba(255, 255, 255, 0.3)",
                    transition: "all 0.3s ease",
                    padding: "0.4rem 1rem",
                    borderRadius: "50px",
                    backdropFilter: scrolled || !isHomePage ? "blur(8px)" : "none",
                    WebkitBackdropFilter: scrolled || !isHomePage ? "blur(8px)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isHomePage && !scrolled 
                      ? "rgba(255, 255, 255, 0.25)" 
                      : "rgba(230, 57, 70, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isHomePage && !scrolled 
                      ? "rgba(255, 255, 255, 0.15)" 
                      : "rgba(255, 255, 255, 0.3)";
                  }}
                >
                  <i 
                    className="bi bi-person-circle fs-4 me-2" 
                    style={{
                      color: isHomePage && !scrolled ? "#ffffff" : "#e63946",
                      transition: "all 0.3s ease",
                      filter: isHomePage && !scrolled 
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.7))' 
                        : 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                    }}
                  ></i>
                  <span 
                    style={{
                      color: isHomePage && !scrolled ? "#ffffff" : "#1d3557",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      textShadow: isHomePage && !scrolled 
                        ? '0 2px 4px rgba(0,0,0,0.8)' 
                        : '0 1px 2px rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease'
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
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)'
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
          color: ${isHomePage && !scrolled ? '#ffffff' : '#e63946'} !important;
          background-color: ${isHomePage && !scrolled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(230, 57, 70, 0.15)'} !important;
          box-shadow: 0 2px 8px ${isHomePage && !scrolled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(230, 57, 70, 0.2)'};
        }
        .nav-link:hover {
          color: ${isHomePage && !scrolled ? '#ffffff' : '#e63946'} !important;
          background-color: ${isHomePage && !scrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(230, 57, 70, 0.1)'} !important;
          transform: translateY(-1px);
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
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-radius: 12px;
            margin-top: 10px;
            padding: 1rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .dropdown-menu {
            background-color: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          .dark-collapse {
            background-color: rgba(0, 0, 0, 0.47) !important;
          }
        }
      `}</style>
    </header>
  );
}

export default Userheader;