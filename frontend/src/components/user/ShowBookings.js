import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import Userheader from "../partials/userHeader";

const ShowBookings = () => {

    const [isUser, setIsUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState(null)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('userRole')

        if (token && role === "user") {
            setIsUser(true)
        } else {
            setIsUser(false)
            navigate('/authentication')
        }
    }, [navigate])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/my-bookings-api`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setBookings(response.data.bookings);
            } catch (err) {
                console.log("error : ", err);
                setMessage("Failed to load concert details");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (isUser === null) return null
    if (loading) return <div className="text-center py-5">Loading concert details...</div>;
    if (message) return <div className="text-center py-5 text-danger">{message}</div>;

    return (
        <>
            <Userheader />
            <div className="min-vh-100 pb-5" style={{ backgroundColor: '#f3f4f6' }}>
                <div className="container-fluid" style={{ paddingTop: '20px' }}>
                    <div className="container">
                        <button onClick={() => navigate(-1)} className="btn pb-2 me-3 d-flex align-items-center">
                            <span className="me-2">←</span>
                            Go Back
                        </button>
                        <h2 className="fw-bold mb-4">My Bookings</h2>

                        {bookings.length === 0 && (
                            <div className="alert alert-info" role="alert">
                                No bookings found. Please check back later.
                            </div>
                        )}

                        <div className="row g-4">
                            {bookings.map(booking => (
                                <div key={booking._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <div
                                        className="card h-100 border-0 shadow-sm booking-card"
                                        style={{
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                        }}
                                    >
                                        <div className="card-img-top position-relative" style={{ height: '100px' }}>
                                            {booking.concertId.concertImage ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${booking.concertId.concertImage}`}
                                                    className="w-100 h-100"
                                                    alt={booking.concertId.concertName}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-center bg-light w-100 h-100">
                                                    <span className="text-muted">No Image</span>
                                                </div>
                                            )}

                                            <div className="position-absolute top-0 start-0 m-2">
                                                <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}>
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="position-absolute top-0 end-0 m-2">
                                                <a
                                                    href={`/bookingconfirmation/${booking?._id}`}
                                                    className="btn btn-sm btn-outline-light rounded-pill"
                                                    style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                                                >
                                                    <FontAwesomeIcon icon={faTicketAlt} className="me-1" />
                                                    Ticket
                                                </a>
                                            </div>
                                        </div>

                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1rem', lineHeight: '1.2' }}>
                                                {booking.concertId.concertName}
                                            </h5>
                                            <div className="d-flex justify-content-between">
                                                <p className="card-text mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                                                    <strong>{new Date(booking.concertId.concertDateTime).toLocaleDateString('en-IN')}</strong>
                                                </p>
                                                <div className="mb-2">
                                                    <span className="badge" style={{ backgroundColor: 'rgba(2, 2, 2, 0.49)' }}>Qty: {booking.ticketsCount}</span>
                                                </div>
                                            </div>
                                            <p className="card-text mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                                {booking.concertId.venue}
                                            </p>
                                        </div>

                                        <div className="card-footer bg-light text-center" style={{ fontSize: '0.75rem' }}>
                                            <div className="text-muted d-flex justify-content-between">
                                                <div>Booked: {new Date(booking.bookingTime).toLocaleDateString('en-IN')}</div>
                                                <div className="mt-1">ID: {booking._id.toString().slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <style jsx>{`
                    .booking-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
                    }
                    
                    .card {
                        overflow: hidden;
                    }
                    
                    .card-title {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    
                    @media (max-width: 575.98px) {
                        .col-12 {
                            margin-bottom: 1rem;
                        }
                    }
                `}</style>
                </div>
            </div>
        </>
    )
}
export default ShowBookings