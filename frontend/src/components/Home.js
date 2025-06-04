import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Userheader from './partials/userHeader';
import Footer from './partials/footer';

const styles = {
    body: {
        fontFamily: 'Roboto, sans-serif',
        backgroundColor: '#f5f5f5',
    },
    bannerSection: {
        position: 'relative',
        height: '550px',
        overflow: 'hidden',
        marginBottom: '3rem',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.7)',
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(231,26,15,0.3) 0%, rgba(0,0,0,0.8) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
    },
    bannerTitle: {
        color: 'white',
        fontSize: '3.5rem',
        fontWeight: 800,
        marginBottom: '1rem',
        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        letterSpacing: '1px',
    },
    bannerSubtitle: {
        color: 'white',
        fontSize: '1.2rem',
        maxWidth: '700px',
        marginBottom: '2rem',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    },
    bannerBtn: {
        padding: '1rem 3rem',
        backgroundColor: 'rgba(231, 26, 15, 1)',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(231, 26, 15, 0.4)',
    },
    searchContainer: {
        width: '100%',
        maxWidth: '450px',
        marginBottom: '1.5rem',
    },
    searchBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '50px',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(5px)',
    },
    searchInput: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        padding: '0.35rem 0.8rem',
        fontSize: '0.9rem',
        color: 'white',
        outline: 'none',
    },
    searchButton: {
        backgroundColor: '#e71a0f',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        padding: '0.35rem 1rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    sectionTitle: {
        marginBottom: '1.5rem',
        fontSize: '2rem',
        fontWeight: 700,
        color: '#333',
        padding: '0 8rem',
    },
    concertsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: '20px',
        padding: '0 8rem',
    },
    concertCard: {
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    posterContainer: {
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    posterImage: {
        width: '100%',
        height: '345px',
        objectFit: 'fill',
    },
    infoBar: {
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '6px 10px',
        fontSize: '0.85rem',
        borderRadius: '0 0 8px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    concertTitle: {
        fontWeight: 600,
        fontSize: '1.1rem',
        margin: '8px 0 5px 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    concertInfo: {
        color: '#6c757d',
        fontSize: '0.9rem',
    },
    seeMoreBtn: {
        margin: '3rem 0',
        padding: '0.8rem 2rem',
        fontSize: '1.1rem',
        border: '2px solid #e71a0f',
        backgroundColor: 'transparent',
        color: '#e71a0f',
        borderRadius: '50px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        letterSpacing: '0.5px',
    },
};

export default function ConcertListingPage() {
    const [concerts, setConcerts] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        axios.get('http://localhost:5000/api/view-concerts-api')
            .then(response => setConcerts(response.data.data))
            .catch(error => console.error('Error fetching concerts:', error));
    }, []);

    const filteredConcerts = concerts.filter(concert =>
        concert.concertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concert.venue.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const visibleConcerts = showAll ? filteredConcerts : filteredConcerts.slice(0, 5);

    return (
        <>
            <Userheader />
            <div style={styles.body}>
                <section style={styles.bannerSection}>
                    <img src="/banner1.png" alt="Concert Experience" style={styles.bannerImage} />
                    <div style={styles.bannerOverlay}>
                        <h1 style={styles.bannerTitle}>Live the Experience</h1>
                        <p style={styles.bannerSubtitle}>Discover unforgettable moments with world-class artists. Book your tickets now for the hottest concerts in town.</p>
                        <div style={styles.searchContainer}>
                            <div style={styles.searchBar}>
                                <input
                                    type="text"
                                    placeholder="Search for concerts, artists, or venues..."
                                    style={styles.searchInput}
                                    className='placeholder-white'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <a
                                    href="#concerts"
                                    style={styles.searchButton}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#c4170d';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 3px 8px rgba(231, 26, 15, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#e71a0f';
                                        e.target.style.transform = 'none';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <i className="bi bi-search"></i>
                                </a>
                            </div>
                        </div>
                        <a href="#concerts" style={styles.bannerBtn} className='banner-btn'>Explore Now</a>
                    </div>
                </section>

                <div id="concerts">
                    <div style={styles.sectionTitle}>Upcoming Concerts</div>
                    <div style={styles.concertsContainer}>
                        {visibleConcerts.map(concert => (
                            <a key={concert._id} href={`/concert/${concert._id}`} style={styles.concertCard} className='concert-card'>
                                <div style={styles.posterContainer}>
                                    <img src={`data:image/jpeg;base64,${concert.concertImage}`} alt={concert.concertName} style={styles.posterImage} />
                                </div>
                                <div style={styles.infoBar}>
                                    <span>
                                        <span style={{ color: '#ff5e00' }}>★</span>&nbsp;
                                        <span>{(Math.random() * 2 + 3).toFixed(1)}/5</span>
                                    </span>
                                    <span>
                                        <span style={{ color: concert.availableTickets < 100 ? 'red' : concert.availableTickets < 200 ? 'orange' : 'green' }}>
                                            {concert.availableTickets} Tickets Left
                                        </span>
                                    </span>
                                </div>
                                <h3 style={styles.concertTitle}>{concert.concertName}</h3>
                                <p style={styles.concertInfo}>
                                    {concert.venue}<br />
                                    {new Date(concert.concertDateTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} | ₹{concert.ticketPrice} onwards
                                </p>
                            </a>
                        ))}
                    </div>
                    {visibleConcerts.length === 0 && (
                        <p style={{ textAlign: 'center', width: '100%', color: 'gray', marginTop: '2rem' }}>
                            No concerts found for "{searchTerm}"
                        </p>
                    )}
                    {!showAll && concerts.length > 5 && (
                        <div style={{ textAlign: 'center' }}>
                            <button style={styles.seeMoreBtn} className='seemore-btn' onClick={() => setShowAll(true)}>See More</button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <style>
                {`
                .placeholder-white::placeholder {
                    color: rgba(240, 228, 228, 0.75);
                }
                .banner-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 15px rgba(231, 26, 15, 0.4);
                }
                .concert-card {
                    transition: all 0.3s ease
                    display: block
                }
                .concert-card:hover {
                    transform: translateY(-5px)
                }
                .seemore-btn {
                    transition: all 0.3s ease
                    display: block
                }
                .seemore-btn:hover {
                    transform: translateY(-5px)
                    
                }
            `}
            </style>
        </>
    );
}
