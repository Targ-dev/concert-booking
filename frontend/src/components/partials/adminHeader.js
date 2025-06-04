import React, { useEffect, useState } from "react";

const Adminnavbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (!isAdmin) return null;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark border-bottom shadow fixed-top" 
           style={{ background: 'linear-gradient(135deg, #343a40 0%, #2f4f4f 100%)' }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-white d-flex align-items-center" href="/dashboard">
            <i className="bi bi-shield-shaded me-2"></i>Admin Dashboard
          </a>
          
          <div className="d-none d-lg-flex">
            <a href="/admin/concerts" className="btn btn-sm btn-outline-light mx-1"> 
              <i className="bi bi-calendar-check me-2"></i>Concerts
            </a>
            <a href="/admin/viewusers" className="btn btn-sm btn-outline-light mx-1">
              <i className="bi bi-people me-2"></i>Users
            </a>
            <a href="/admin/allbookings" className="btn btn-sm btn-outline-light mx-1">
              <i className="bi bi-cart-check me-2"></i>Orders
            </a>
          </div>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" 
                  aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-lg-none">
              <li className="nav-item">
                <a className="nav-link" href="/admin/concerts">
                  <i className="bi bi-cart-check me-2"></i>Concerts
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/viewusers">
                  <i className="bi bi-people me-2"></i>Users
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/allbookings">
                  <i className="bi bi-calendar-check me-2"></i>Orders
                </a>
              </li>
            </ul>
            
            <div className="d-flex align-items-center ms-auto">
              <div className="dropdown">
                <button className="btn btn-light rounded-circle p-0 position-relative" 
                        type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=4e73df&color=fff&size=36" 
                       className="rounded-circle" width="36" height="36" alt="Admin" />
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                    <span className="visually-hidden">Online</span>
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-lg-end shadow-lg border-0">
                  <li>
                    <div className="d-flex align-items-center px-3 py-2 mb-2">
                      <img src="https://ui-avatars.com/api/?name=Admin&background=4e73df&color=fff&size=64" 
                           className="rounded-circle me-2" width="40" height="40" alt="Admin" />
                      <div>
                        <h6 className="mb-0 fw-bold">Admin User</h6>
                        <small className="text-muted">Super Administrator</small>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  
                  <li><a className="dropdown-item py-2 text-danger" href="/logout"><i className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .btn {
            transition: transform 0.3s
          }
          .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </nav>
    </>
  );
};

export default Adminnavbar;