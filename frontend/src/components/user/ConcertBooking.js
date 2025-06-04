import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Userheader from "../partials/userHeader";
import Footer from "../partials/footer";
import { jwtDecode } from "jwt-decode";

const ConcertBooking = () => {

    const [isUser, setIsUser] = useState(null)
    const { concertId } = useParams()
    const [concert, setConcerts] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fullName, setFullName] = useState(null)
    const [email, setEmail] = useState(null)
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    })
    const navigate = useNavigate()
    const serviceFee = 50

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('userRole')
        console.log(token)

        if (token && role === "user") {
            setIsUser(true)
            const decode = jwtDecode(token)
            setFullName(decode.name)
            setEmail(decode.email)
        } else {
            setIsUser(false)
            navigate('/authentication')
        }
    }, [navigate])

    useEffect(() => {
        const fetchConcert = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/concert-details-api/${concertId}`);
                setConcerts(response.data.concert);
            } catch (err) {
                console.log("error : ", err);
                setMessage("Failed to load concert details");
            } finally {
                setLoading(false);
            }
        };

        fetchConcert();
    }, [concertId]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 3) {
            setQuantity(newQuantity);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')

            const response = await axios.post(`http://localhost:5000/api/concert-booking-api`,
                {
                    id: concertId,
                    ticketsCount: quantity,
                    ...formData
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            const bookingId = response.data.bookingId
            setMessage(`Booking successful! Booking ID: ${response.data.bookingId}`)
            navigate(`/bookingconfirmation/${bookingId}`)
        } catch (err) {
            setMessage(err.response?.data?.error || "Something went wrong with the booking")
        }
    }

    if (isUser === null) return null;
    if (loading) return <div className="text-center py-5">Loading concert details...</div>;
    if (!concert) return <div className="text-center py-5">Concert not found</div>;

    const total = concert.ticketPrice * quantity + serviceFee;

    return (
        <>
            <Userheader />
            <div className="container-fluid" style={{ paddingTop: "20px", backgroundColor: "#f8f9fa", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontSize: "0.9rem" }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="p-3 bg-white rounded shadow-sm mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h1 className="fw-bold mb-0" style={{ fontSize: "1.4rem" }}>Book Tickets</h1>
                                <a href="/" className="text-primary text-decoration-none" style={{ fontSize: "0.85rem" }}>
                                    <i className="fas fa-arrow-left me-1"></i> Back to Concerts
                                </a>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                            <img
                                                src={`data:image/jpeg;base64,${concert.concertImage}`}
                                                alt={concert.concertName}
                                                className="img-fluid rounded mb-2"
                                                style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                            />
                                            <h2 className="fw-bold mb-1" style={{ fontSize: "1.1rem" }}>{concert.concertName}</h2>
                                            <div className="d-flex align-items-center text-secondary mb-1">
                                                <i className="fas fa-calendar me-1" style={{ fontSize: "0.8rem" }}></i>
                                                <span style={{ fontSize: "0.8rem" }}>
                                                    {new Date(concert.concertDateTime).toLocaleString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    }).replace(',', ' at')}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center text-secondary mb-2">
                                                <i className="fas fa-ticket-alt me-1" style={{ fontSize: "0.8rem" }}></i>
                                                <span style={{ fontSize: "0.8rem" }}>{concert.venue}</span>
                                            </div>

                                            <div className="bg-light rounded p-2 mt-2">
                                                <h3 className="fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>Booking Summary</h3>
                                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.8rem" }}>
                                                    <span>General Admission x {quantity}</span>
                                                    <span>₹{concert.ticketPrice * quantity}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.8rem" }}>
                                                    <span>Service Fee</span>
                                                    <span>₹{serviceFee}</span>
                                                </div>
                                                <hr className="my-2" />
                                                <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "0.85rem" }}>
                                                    <span>Total</span>
                                                    <span>₹{total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-body">
                                            {message && (
                                                <div className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"} mb-3`}>
                                                    {message}
                                                </div>
                                            )}
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <h2 className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>Select Tickets</h2>
                                                    <div className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                                                        <strong>General Admission</strong> - ₹{concert.ticketPrice} per ticket
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Number of Tickets</label>
                                                        <div className="d-inline-flex align-items-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary p-0"
                                                                style={{ width: "25px", height: "25px", fontSize: "0.8rem" }}
                                                                onClick={() => handleQuantityChange(-1)}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                name="ticketsCount"
                                                                className="form-control text-center mx-1"
                                                                style={{ width: "45px", height: "25px", fontSize: "0.8rem", padding: "0.2rem" }}
                                                                value={quantity}
                                                                min="1"
                                                                max="3"
                                                                readOnly
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary p-0"
                                                                style={{ width: "25px", height: "25px", fontSize: "0.8rem" }}
                                                                onClick={() => handleQuantityChange(1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>&nbsp;Max 3 tickets per person!</span>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <h2 className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>Contact Information</h2>
                                                    <div className="row g-2">
                                                        <div className="col-md-6">
                                                            <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Full Name</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text" style={{ padding: "0.3rem 0.5rem", fontSize: "0.85rem" }}>
                                                                    <i className="fas fa-user"></i>
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    name="fullName"
                                                                    className="form-control"
                                                                    style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                                                                    value={fullName}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Email</label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-control"
                                                                style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                                                                value={email}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <h2 className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>Payment Details</h2>
                                                    <div className="mb-2">
                                                        <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Card Number</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text" style={{ padding: "0.3rem 0.5rem", fontSize: "0.85rem" }}>
                                                                <i className="fas fa-credit-card"></i>
                                                            </span>
                                                            <input
                                                                type="text"
                                                                name="cardNumber"
                                                                className="form-control"
                                                                placeholder="1234 5678 9012 3456"
                                                                style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                                                                value={formData.cardNumber}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row g-2">
                                                        <div className="col-md-6">
                                                            <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>Expiry Date</label>
                                                            <input
                                                                type="text"
                                                                name="expiryDate"
                                                                className="form-control"
                                                                placeholder="MM/YY"
                                                                style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                                                                value={formData.expiryDate}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.2rem" }}>CVV</label>
                                                            <input
                                                                type="text"
                                                                name="cvv"
                                                                className="form-control"
                                                                placeholder="123"
                                                                style={{ fontSize: "0.85rem", padding: "0.3rem 0.5rem" }}
                                                                value={formData.cvv}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="btn w-100 fw-semibold"
                                                    style={{
                                                        backgroundColor: "#e21b24",
                                                        color: "white",
                                                        padding: "0.5rem",
                                                        fontSize: "0.9rem",
                                                        transition: "background-color 0.3s"
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = "#0b5ed7"}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = "#e21b24"}
                                                >
                                                    Complete Purchase - ₹{total}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ConcertBooking