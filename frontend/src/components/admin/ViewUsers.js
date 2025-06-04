import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Adminnavbar from "../partials/adminHeader";

const ViewUsers = () => {

    const [isAdmin, setIsAdmin] = useState(null)
    const [users, setUsers] = useState(null)
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
        axios.get('http://localhost:5000/api/view-users-api', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => setUsers(response.data.users))
            .catch(error => console.error('Error fetching concerts:', error));
    }, [])
    console.log(users)

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
 
            <div className="container d-flex flex-column justify-content-center">
                <div className="d-flex mt-4 border-bottom">
                    <h4 className="fw-bold">Users</h4>
                </div>

                <div className="table-responsive mt-4">
                    <table className="table table-striped table-hover border-1 shadow-sm rounded-4 overflow-hidden">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col" className="px-3 py-3 d-none d-md-table-cell">#</th>
                                <th scope="col" className="px-3 py-3">Name</th>
                                <th scope="col" className="px-3 py-3 d-none d-lg-table-cell">Email</th>
                                <th scope="col" className="px-3 py-3 d-none d-sm-table-cell">Role</th>
                                <th scope="col" className="px-3 py-3 d-none d-sm-table-cell">Status</th>
                                <th scope="col" className="px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.map((user, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {user.active ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-secondary">Inactive</span>
                                        )}
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-danger" onClick={() => navigate(`/admin/${user._id}/userbookings`)}>
                                            View Bookings
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default ViewUsers