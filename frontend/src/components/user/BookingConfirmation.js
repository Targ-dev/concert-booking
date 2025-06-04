import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BookingConfirmation = () => {

    const [isLogged, setIsLogged] = useState(null)
    const { bookingId } = useParams()
    const [ticket, setTicket] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            setIsLogged(true)
        } else {
            setIsLogged(false)
            navigate('/authentication')
        }
    }, [navigate])

    useEffect(() => {
        const fetchBooking = async () => {
            const token = localStorage.getItem('token')

            try {
                const response = await axios.get(`http://localhost:5000/api/booking-confirmation-api/${bookingId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setTicket({
                    concert: response.data.concert,
                    booking: response.data.booking,
                    user: response.data.user
                });
            } catch (err) {
                console.log("error : ", err);
                setMessage("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        if (isLogged) {
            fetchBooking();
        }
    }, [isLogged, bookingId])

    const handleDownload = async (e) => {
        e.preventDefault();
        setModalMessage("Generating PDF...");
        setShowModal(true);

        try {
            const res = await fetch(`http://localhost:5000/booking/generate-pdf/${ticket?.booking._id}`, {
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "booking-confirmation.pdf";

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setShowModal(false);
        } catch (err) {
            console.error(err);
            setModalMessage("Failed to generate PDF.");
            setTimeout(() => setShowModal(false), 2000);
        }
    };

    const handleEmail = async (e) => {
        e.preventDefault();
        setModalMessage("Sending email...");
        setShowModal(true);

        try {
            const token = localStorage.getItem('token')

            const res = await axios.get(`http://localhost:5000/api/send-email-api/${ticket?.booking._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setModalMessage("Email sent successfully!");
        } catch (err) {
            console.error(err);
            setModalMessage("Failed to send email.");
        } finally {
            setTimeout(() => setShowModal(false), 2000);
        }
    };

    if (isLogged === null) return null
    if (loading) return <div className="text-center py-5">Loading concert details...</div>
    if (message) return <div className="text-center py-5 text-red-500">{message}</div>

    const serviceFee = 50
    const total = ticket?.booking.totalPrice + serviceFee

    return (
        <>
            <div style={{
                background: 'linear-gradient(135deg, #93202b 0%, #240b3d 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <div className="container-fluid" style={{ width: 'auto !important' }}>
                    <div className="ticket-container" style={{
                        perspective: '1000px',
                        margin: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: '700px'
                    }}>
                        <div className="ticket row g-0" style={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            borderRadius: '15px',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                            overflow: 'hidden',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.3s ease',
                            width: '100%',
                            height: '320px'
                        }}>
                            {/* Left side */}
                            <div className="col-md-5 ticket-left d-flex align-items-center justify-content-center p-3 position-relative" style={{
                                background: 'linear-gradient(135deg, rgb(214 25 25) 0%, rgb(79 0 0) 100%)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div className="perforation" style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '0',
                                    bottom: '0',
                                    width: '2px',
                                    background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 6px, #fff 6px, #fff 9px)'
                                }}></div>
                                <div className="qr" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    width: '100%'
                                }}>
                                    <div className="d-flex align-items-center justify-content-center" style={{ flex: '8' }}>
                                        <div className="qr-placeholder" style={{
                                            background: 'transparent',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            width: '60px',
                                            height: '60px'
                                        }}>
                                            <img
                                                src={`https://quickchart.io/qr?text=${encodeURIComponent(ticket?.booking._id)}&size=150&format=png&margin=1&light=0000`}
                                                alt="QR Code"
                                                className="mb-3"
                                                style={{ maxWidth: '130px', height: 'auto' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center text-white" style={{ flex: '2' }}>
                                        <div className="price-tag px-3 py-2 mt-2" style={{
                                            background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                                            color: 'white',
                                            borderRadius: '40px',
                                            display: 'inline-block',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                        }}>
                                            <h2 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>₹{total}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="col-md-7 ticket-right p-3 position-relative" style={{
                                background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
                                color: 'white',
                                position: 'relative'
                            }}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <p className="text-warning mb-1 fw-bold live-concert-text" style={{
                                            letterSpacing: '0.8px',
                                            fontSize: '0.65rem'
                                        }}>LIVE CONCERT PRESENTS</p>
                                        <h2 className="event-title mb-1" style={{
                                            background: 'linear-gradient(135deg,rgb(254, 77, 77) 0%,rgb(211, 19, 19) 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            fontWeight: '800',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                            fontSize: '1.4rem'
                                        }}>{ticket?.concert.concertName.toUpperCase()}</h2>
                                        <p className="text-light mb-0 world-tour-text" style={{
                                            opacity: '0.8',
                                            fontSize: '0.75rem'
                                        }}>World Tour 2025</p>
                                    </div>
                                </div>

                                <div className="row g-2 mt-1">
                                    <div className="col-6">
                                        <div className="detail-row py-1 px-2 rounded" style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.3s ease'
                                        }}>
                                            <div className="detail-label" style={{
                                                color: '#bdc3c7',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.8px',
                                                fontSize: '0.65rem'
                                            }}>Date & Time</div>
                                            <div className="detail-value" style={{
                                                color: '#ecf0f1',
                                                fontWeight: '500',
                                                fontSize: '0.85rem'
                                            }}>{new Date(ticket?.booking.bookingTime).toLocaleString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="detail-row py-1 px-2 rounded" style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.3s ease'
                                        }}>
                                            <div className="detail-label" style={{
                                                color: '#bdc3c7',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.8px',
                                                fontSize: '0.65rem'
                                            }}>Persons</div>
                                            <div className="detail-value" style={{
                                                color: '#ecf0f1',
                                                fontWeight: '500',
                                                fontSize: '0.85rem'
                                            }}>{ticket?.booking.ticketsCount} Adults</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="detail-row py-1 px-2 rounded" style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.3s ease'
                                        }}>
                                            <div className="detail-label" style={{
                                                color: '#bdc3c7',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.8px',
                                                fontSize: '0.65rem'
                                            }}>Location</div>
                                            <div className="detail-value" style={{
                                                color: '#ecf0f1',
                                                fontWeight: '500',
                                                fontSize: '0.85rem'
                                            }}>{ticket?.concert.venue}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="detail-row py-1 px-2 rounded" style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.3s ease'
                                        }}>
                                            <div className="detail-label" style={{
                                                color: '#bdc3c7',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.8px',
                                                fontSize: '0.65rem'
                                            }}>Total Price</div>
                                            <div className="detail-value fw-bold" style={{
                                                color: '#ecf0f1',
                                                fontWeight: '500',
                                                fontSize: '0.85rem'
                                            }}>₹{total}.00</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="detail-row py-1 px-2 rounded" style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.3s ease'
                                        }}>
                                            <div className="detail-label" style={{
                                                color: '#bdc3c7',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.8px',
                                                fontSize: '0.65rem'
                                            }}>Guest Name</div>
                                            <div className="detail-value" style={{
                                                color: '#ecf0f1',
                                                fontWeight: '500',
                                                fontSize: '0.85rem'
                                            }}>{ticket?.user.name}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="booking-id py-1 px-2 text-center" style={{
                                        background: 'linear-gradient(135deg, #3498db, #2980b9)',
                                        color: 'white',
                                        borderRadius: '6px',
                                        fontFamily: "'Courier New', monospace",
                                        letterSpacing: '1.5px'
                                    }}>
                                        <div className="detail-label mb-1" style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '0.65rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.8px'
                                        }}>Booking ID</div>
                                        <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{ticket?.booking._id.toString().slice(-6).toUpperCase()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-center mt-3 gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="btn text-white px-4 py-2 rounded-pill border-bottom"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                transition: 'transform 0.3s ease',
                                fontWeight: '600'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Go Home
                        </button>

                        <button
                            onClick={handleDownload}
                            className="btn text-white px-4 py-2 rounded-pill border-bottom"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                transition: 'transform 0.3s ease',
                                fontWeight: '600'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Download
                        </button>

                        <button
                            onClick={handleEmail}
                            className="btn text-white px-4 py-2 rounded-pill border-bottom"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                transition: 'transform 0.3s ease',
                                fontWeight: '600'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Send Mail
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Modal */}
            {showModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999
                    }}
                >
                    <div
                        className="bg-white text-center rounded p-4"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            color: '#1d3557',
                            fontSize: '16px',
                            minWidth: '300px'
                        }}
                    >
                        {modalMessage}
                    </div>
                </div>
            )}

            <style jsx>{`
                .container-fluid {
                    width: auto !important;
                }
                
                body {
                    padding-top: 0
                }

                @media (max-width: 768px) {
                .ticket-container {
                    margin: 10px;
                    max-width: 100%;
                }
                
                .ticket {
                    height: auto;
                    min-height: 280px;
                    border-radius: 12px;
                }
                
                .ticket-left, .ticket-right {
                    padding: 15px !important;
                }
                
                .qr-placeholder {
                    width: 50px;
                    height: 50px;
                }
                
                .price-tag h2 {
                    font-size: 1.2rem;
                }
                
                .event-title {
                    font-size: 1.1rem;
                }
                
                .live-concert-text {
                    font-size: 0.6rem;
                }
                
                .world-tour-text {
                    font-size: 0.7rem;
                }
                
                .detail-label {
                    font-size: 0.6rem;
                }
                
                .detail-value {
                    font-size: 0.8rem;
                }
                
                .booking-id {
                    font-size: 0.8rem;
                }
                }

                @media (max-width: 576px) {
                .ticket {
                    min-height: 260px;
                    border-radius: 10px;
                }
                
                .ticket-left, .ticket-right {
                    padding: 12px !important;
                }
                
                .qr-placeholder {
                    width: 45px;
                    height: 45px;
                }
                
                .price-tag {
                    padding: 6px 12px !important;
                }
                
                .price-tag h2 {
                    font-size: 1rem;
                }
                
                .event-title {
                    font-size: 1rem;
                }
                
                .detail-label {
                    font-size: 0.55rem;
                }
                
                .detail-value {
                    font-size: 0.75rem;
                }
                }

                .detail-row:hover {
                background-color: rgba(255,255,255,0.05);
                }
            `}</style>
        </>
    )
}
export default BookingConfirmation