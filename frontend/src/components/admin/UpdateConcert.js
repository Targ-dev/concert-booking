import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Adminnavbar from "../partials/adminHeader";

const UpdateConcert = () => {
  const { concertId } = useParams();
  const [concert, setConcert] = useState(null);
  const [formData, setFormData] = useState({
    concertName: "",
    concertDateTime: "",
    venue: "",
    ticketPrice: "",
    availableTickets: "",
    concertDescription: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [concertImageFile, setConcertImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/concert-details-api/${concertId}`)
      .then((response) => {
        const data = response.data.concert;
        setConcert(data);
        setFormData({
          concertName: data.concertName,
          concertDateTime: data.concertDateTime.slice(0, 16),
          venue: data.venue,
          ticketPrice: data.ticketPrice,
          availableTickets: data.availableTickets,
          concertDescription: data.concertDescription,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load content");
        setLoading(false);
      });
  }, [concertId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const imageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setConcertImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (concertImageFile) {
      data.append("concertImage", concertImageFile);
    }
    console.log('token:',localStorage.getItem("token"))

    try {
      await axios.put(`http://localhost:5000/api/update-concert-api/${concertId}`, data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Concert updated successfully!");
      navigate('/admin/concerts')
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update concert.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!concert) return <p>No concert found</p>;

  return (
    <>
      <Adminnavbar/>
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
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10 col-xxl-8">
            <div className="shadow-lg p-3 p-md-4 bg-white rounded">
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <h2 className="mb-4 text-center text-lg-start">Update Concert</h2>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {[
                      { label: "Concert Name", name: "concertName", type: "text" },
                      {
                        label: "Date and Time",
                        name: "concertDateTime",
                        type: "datetime-local",
                      },
                      { label: "Venue", name: "venue", type: "text" },
                      { label: "Ticket Price", name: "ticketPrice", type: "number" },
                      {
                        label: "Available Tickets",
                        name: "availableTickets",
                        type: "number",
                      },
                    ].map(({ label, name, type }) => (
                      <div className="mb-3" key={name}>
                        <label htmlFor={name} className="form-label">
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          id={name}
                          value={formData[name]}
                          className="form-control"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}

                    <div className="mb-3">
                      <label htmlFor="concertDescription" className="form-label">
                        Description
                      </label>
                      <textarea
                        name="concertDescription"
                        id="concertDescription"
                        rows="4"
                        className="form-control"
                        value={formData.concertDescription}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="concertImage" className="form-label">
                        Upload New Image
                      </label>
                      <input
                        type="file"
                        name="concertImage"
                        className="form-control"
                        id="concertImage"
                        accept="image/*"
                        onChange={imageChange}
                      />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                      Update Concert
                    </button>
                  </form>
                </div>

                <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
                  <div className="text-center w-100">
                    <p className="text-muted">Current Concert Image</p>
                    <img
                      src={
                        previewImage ||
                        (concert?.concertImage
                          ? `data:image/jpeg;base64,${concert.concertImage}`
                          : "")
                      }
                      alt="Concert"
                      className="img-fluid img-thumbnail rounded shadow-sm"
                      style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "cover" }}
                    />
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

export default UpdateConcert;