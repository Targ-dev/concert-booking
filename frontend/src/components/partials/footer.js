import React from 'react';

function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#0b0c10',
      color: '#f8f9fa',
      padding: '3.5rem 0 1.5rem',
    },
    heading: {
      color: '#ffffff',
      fontWeight: 600,
      marginBottom: '1.2rem',
      fontSize: '1.1rem',
    },
    paragraph: {
      color: '#dce1e8',
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    link: {
      color: '#dce1e8',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      display: 'inline-block',
      fontSize: '0.95rem',
      marginBottom: '0.75rem',
    },
    linkHover: {
      color: '#ffffff',
      transform: 'translateX(3px)',
    },
    iconWrap: {
      display: 'flex',
      gap: '12px',
      marginTop: '1rem',
    },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      transition: 'all 0.3s',
    },
    iconHover: {
      backgroundColor: '#e63946',
      transform: 'translateY(-3px)',
    },
    highlightIcon: {
      color: '#e63946',
      marginRight: '0.5rem',
    },
    copyright: {
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '1.5rem',
      marginTop: '2.5rem',
      fontSize: '0.85rem',
      color: '#b0b8c1',
    }
  };

  return (
    <footer style={styles.footer}>
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-md-4 mb-4">
            <h5 style={styles.heading}>ConcertHub</h5>
            <p style={styles.paragraph}>
              Your gateway to live music experiences. Find and book tickets to concerts happening across the country.
            </p>
            <div style={styles.iconWrap}>
              <a href="#" style={styles.icon}><i className="bi bi-facebook"></i></a>
              <a href="#" style={styles.icon}><i className="bi bi-twitter"></i></a>
              <a href="#" style={styles.icon}><i className="bi bi-instagram"></i></a>
              <a href="#" style={styles.icon}><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-md-2 mb-4">
            <h5 style={styles.heading}>Quick Links</h5>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              <li><a href="#" style={styles.link}>Home</a></li>
              <li><a href="#" style={styles.link}>Concerts</a></li>
              <li><a href="#" style={styles.link}>Venues</a></li>
              <li><a href="#" style={styles.link}>About Us</a></li>
              <li><a href="#" style={styles.link}>Contact</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-md-3 mb-4">
            <h5 style={styles.heading}>Support</h5>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              <li><a href="#" style={styles.link}>Help Center</a></li>
              <li><a href="#" style={styles.link}>Terms of Service</a></li>
              <li><a href="#" style={styles.link}>Privacy Policy</a></li>
              <li><a href="#" style={styles.link}>Refund Policy</a></li>
              <li><a href="#" style={styles.link}>FAQs</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="col-md-3 mb-4">
            <h5 style={styles.heading}>Contact Us</h5>
            <p style={styles.paragraph}><i className="bi bi-geo-alt" style={styles.highlightIcon}></i>123 Music Street, Mumbai, India</p>
            <p style={styles.paragraph}><i className="bi bi-telephone" style={styles.highlightIcon}></i>+91 98765 43210</p>
            <p style={styles.paragraph}><i className="bi bi-envelope" style={styles.highlightIcon}></i>info@concerthub.com</p>
          </div>
        </div>

        <div className="text-center" style={styles.copyright}>
          <p className="mb-0">&copy; 2025 ConcertHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
