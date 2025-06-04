import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Adminnavbar from "../partials/adminHeader";
import axios from "axios";

const AddConcert = () => {
    const [isAdmin, setIsAdmin] = useState(null)
    const [formData, setFormData] = useState({
        concertName: "",
        concertDateTime: "",
        venue: "",
        ticketPrice: "",
        availableTickets: "",
        concertDescription: "",
    })
    const [concertImageFile, setConcertImageFile] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const imageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setConcertImageFile(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()
        for (let key in formData) {
            data.append(key, formData[key])
        }
        data.append('concertImage', concertImageFile)

        try {
            await axios.post("http://localhost:5000/api/add-concert-api", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            alert("Concert added succefully")
            navigate('/admin/concerts')
        } catch (err) {
            console.error("Add concert failed:", err);
            alert("Failed to add concert.");
        }
    }

    if (isAdmin === null) return null

    return (
        <>
            <Adminnavbar />
            <div className="container-fluid px-3 px-md-4">
                <div className="row">
                    <div className="col-12">
                        <button
                            className="btn btn-link text-decoration-none fw-semibold p-0 mt-3"
                            onClick={() => window.history.back()}
                        >
                            <i className="bi bi-arrow-left me-1"></i> Back
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="container-fluid px-3 px-md-4 py-4 mb-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10 col-xxl-8">
                        <div className="shadow-lg p-3 p-md-4 bg-white rounded">
                            <div className="row g-4">
                                <div className="col-12 col-lg-6">
                                    <h2 className="mb-4 text-center text-lg-start">Add Concert</h2>
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                        {[
                                            { label: "Concert Name", name: "concertName", type: "text" },
                                            { label: "Date and Time", name: "concertDateTime", type: "datetime-local" },
                                            { label: "Venue", name: "venue", type: "text" },
                                            { label: "Ticket Price", name: "ticketPrice", type: "number" },
                                            { label: "Available Tickets", name: "availableTickets", type: "number" },
                                        ].map(({ label, name, type }) => (
                                            <div className="mb-3" key={name}>
                                                <label htmlFor={name} className="form-label">{label}</label>
                                                <input
                                                    type={type}
                                                    name={name}
                                                    id={name}
                                                    className="form-control"
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        ))}

                                        <div className="mb-3">
                                            <label htmlFor="concertDescription" className="form-label">Description</label>
                                            <textarea
                                                name="concertDescription"
                                                className="form-control"
                                                id="concertDescription"
                                                rows="4"
                                                placeholder="Enter concert description"
                                                value={formData.concertDescription}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="concertImage" className="form-label">Concert Image</label>
                                            <input
                                                type="file"
                                                name="concertImage"
                                                className="form-control"
                                                id="concertImage"
                                                accept="image/*"
                                                onChange={imageChange}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">
                                            Submit
                                        </button>
                                    </form>
                                </div>
                                
                                <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
                                    <div className="w-100">
                                        {previewImage && (
                                            <div className="text-center">
                                                <p className="text-muted mb-3">Image Preview</p>
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="img-fluid img-thumbnail rounded shadow-sm"
                                                    style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }}
                                                />
                                            </div>
                                        )}
                                        {!previewImage && (
                                            <div className="text-center text-muted">
                                                <i className="bi bi-image display-1 mb-3 d-block"></i>
                                                <p>Select an image to see preview</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddConcert