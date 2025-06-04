import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Adminnavbar from '../partials/adminHeader';
import { useNavigate } from 'react-router-dom';

const ConcertManagement = () => {

  const [concerts, setConcerts] = useState([])
  const [isAdmin, setIsAdmin] = useState(null)
  const [concertDelete, setConcertDelete] = useState(null)
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-concert-api/${concertDelete}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    alert("Concert deleted succesfully")
    window.location.reload()
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete concert.");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/view-concerts-admin-api', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setConcerts(response.data.data))
      .catch(error => console.error('Error fetching concerts:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')

    if (token && role === "admin") {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      navigate('/authentication')
    }
  }, [navigate])

  if (isAdmin === null) return null

  return (
    <>
      <Adminnavbar />
      <div className="container-fluid px-3 px-md-4">
        <div className="row">
          <div className="col-12">
            <button className="btn btn-link text-decoration-none fw-semibold p-0 mt-3" onClick={() => window.history.back()}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-4 py-4">
        <div className="row">
          <div className="col-12">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom">
              <h4 className="fw-bold text-dark mb-2 mb-md-0">Concert Management</h4>
              <a href="/admin/addconcert" className="btn btn-success rounded-pill shadow-sm">
                <i className="bi bi-plus-lg me-1"></i> Add Concert
              </a>
            </div>

            <div className="card border-1 shadow rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" className="px-3 py-3 d-none d-md-table-cell">#</th>
                      <th scope="col" className="px-3 py-3">Concert</th>
                      <th scope="col" className="px-3 py-3 d-none d-lg-table-cell">Date & Time</th>
                      <th scope="col" className="px-3 py-3 d-none d-xl-table-cell">Venue</th>
                      <th scope="col" className="px-3 py-3 d-none d-lg-table-cell">Price</th>
                      <th scope="col" className="px-3 py-3 d-none d-lg-table-cell">Available</th>
                      <th scope="col" className="px-3 py-3 d-none d-md-table-cell">Image</th>
                      <th scope="col" className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(concerts) && concerts.map((concert, index) => (
                      <tr key={concert._id}>
                        <th scope="row" className="fw-medium px-3 py-3 d-none d-md-table-cell">{index + 1}</th>
                        <td className="px-3 py-3">
                          <div className="fw-medium">{concert.concertName}</div>

                          <div className="d-lg-none">
                            <small className="text-muted d-block">
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(concert.concertDateTime).toLocaleDateString()}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bi bi-geo-alt me-1"></i>
                              {concert.venue}
                            </small>
                            <div className="mt-1">
                              <span className="badge bg-success bg-opacity-10 text-success me-2">₹{concert.ticketPrice}</span>
                              <span className="badge bg-primary bg-opacity-10 text-primary">
                                <i className="bi bi-ticket-perforated me-1"></i>{concert.availableTickets}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 d-none d-lg-table-cell">
                          <div><i className="bi bi-calendar3 me-1"></i>{new Date(concert.concertDateTime).toLocaleDateString()}</div>
                          <div className="text-muted"><i className="bi bi-clock me-1"></i>{new Date(concert.concertDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-3 py-3 d-none d-xl-table-cell">
                          <div><i className="bi bi-geo-alt me-1"></i>{concert.venue}</div>
                        </td>
                        <td className="px-3 py-3 d-none d-lg-table-cell">
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">₹{concert.ticketPrice}</span>
                        </td>
                        <td className="px-3 py-3 d-none d-lg-table-cell">
                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                            <i className="bi bi-ticket-perforated me-1"></i>{concert.availableTickets}
                          </span>
                        </td>
                        <td className="px-3 py-3 d-none d-md-table-cell">
                          <img
                            src={`data:image/jpeg;base64,${concert.concertImage}`}
                            alt={concert.concertName}
                            className="rounded"
                            style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="d-flex gap-2">
                            <a
                              href={`/admin/updateconcert/${concert._id}`}
                              title="Edit"
                              className="btn btn-sm btn-outline-primary rounded-2 d-flex align-items-center justify-content-center"
                              style={{ width: '36px', height: '36px' }}
                            >
                              <i className="bi bi-pencil"></i>
                            </a>
                            <button
                              title="Delete"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                              onClick={() => setConcertDelete(concert._id)}
                              className="btn btn-sm btn-outline-danger rounded-2 d-flex align-items-center justify-content-center"
                              style={{ width: '36px', height: '36px' }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-3 shadow">
                  <div className="modal-header border-bottom">
                    <h5 className="modal-title fw-bold" id="deleteModalLabel">Confirm Delete</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body py-4 text-center">
                    <div className="mb-3">
                      <i className="bi bi-exclamation-triangle text-danger display-4"></i>
                    </div>
                    <p className="mb-0">Are you sure you want to delete this concert?<br />This action cannot be undone.</p>
                  </div>
                  <div className="modal-footer border-top">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button id="confirmDeleteBtn" href="#" className="btn btn-danger" onClick={handleDelete}>Delete Concert</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConcertManagement;