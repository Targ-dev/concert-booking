import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Adminnavbar from "../partials/adminHeader";

const AllBookings = () => {
    const [isAdmin, setIsAdmin] = useState(null)
    const [allBookings, setAllBookings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

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

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/all-bookings-api`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setAllBookings(response.data.bookings)
            } catch (err) {
                console.log("error : ", err);
                setMessage("Failed to load concert details");
            } finally {
                setLoading(false);
            }
        }
        fetchBookings()
    }, [])

    if (isAdmin === null) return null
    if (loading) return <div className="text-center py-5">Loading concert details...</div>;
    if (message) return <div className="text-center py-5 text-danger">{message}</div>;

    return (
        <>
            <Adminnavbar />
            <div style={{ backgroundColor: '#f3f4f6', height: '100vh' }}>
                <div className="container-fluid px-3 px-md-4">
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-link text-decoration-none fw-semibold p-0 mt-3" onClick={() => window.history.back()}>
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container d-flex flex-column justify-content-center pb-5">
                    <div className="d-flex mt-4 justify-content-center border-bottom">
                        <h3 className="fw-bold text-center">
                            All Users Booking
                        </h3>
                    </div>

                    <div className="table-responsive mt-4 w-100" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <table className="table table-bordered table-striped table-hover border-1 shadow-sm rounded-4 overflow-hidden">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th scope="col" className="px-3 py-3">#</th>
                                    <th scope="col" className="px-3 py-3 text-start">Concert</th>
                                    <th scope="col" className="px-3 py-3 text-start">Name</th>
                                    <th scope="col" className="px-3 py-3 text-start">Email</th>
                                    <th scope="col" className="px-3 py-3">Tickets</th>
                                    <th scope="col" className="px-3 py-3">Total Price</th>
                                    <th scope="col" className="px-3 py-3 d-none d-sm-table-cell">Status</th>
                                    <th scope="col" className="px-3 py-3">Booking Time</th>
                                    <th scope="col" className="px-3 py-3">Booking ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBookings && allBookings.length > 0 ? (
                                    allBookings.map((booking, index) => (
                                        <tr key={booking._id}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-start">{booking.concertId.concertName}</td>
                                            <td className="text-start">{booking.userId.name}</td>
                                            <td className="text-start">{booking.userId.email}</td>
                                            <td className="text-center">{booking.ticketsCount}</td>
                                            <td className="text-center">{booking.totalPrice}</td>
                                            <td className="text-center d-none d-sm-table-cell">
                                                <span className="btn btn-success btn-sm">Booked</span>
                                            </td>
                                            <td className="text-center">
                                                {new Date(booking.bookingTime).toLocaleString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: true
                                                })}
                                            </td>
                                            <td className="text-center">{booking._id.toString().slice(-6).toUpperCase()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4">No bookings found...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AllBookings