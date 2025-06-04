import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Userheader from './partials/userHeader';
import Footer from './partials/footer';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    backgroundColor: '#f5f5f5'
  },
  hero: (backgroundImage) => ({
    height: '480px',
    backgroundColor: '#333',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("data:image/jpeg;base64,${backgroundImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  }),
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    width: '100%'
  },
  poster: {
    width: '280px',
    height: '400px',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    backgroundColor: '#555',
    flexShrink: 0
  },
  posterImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  info: {
    marginLeft: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: '38px',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  ratingValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '10px'
  },
  votes: {
    color: '#ccc'
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '20px',
    gap: '15px',
    alignItems: 'center'
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '5px 15px',
    borderRadius: '5px',
    fontSize: '14px'
  },
  specs: {
    fontSize: '16px',
    color: '#ddd',
    marginBottom: '25px'
  },
  bookBtn: {
    backgroundColor: '#e21b24',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: 'fit-content',
    textDecoration: 'none',
    display: 'inline-block'
  },
  rateBtn: {
    backgroundColor: 'white',
    color: '#333',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    marginLeft: '15px',
    cursor: 'pointer'
  },
  shareBtn: {
    position: 'absolute',
    right: '20px',
    top: '20px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px'
  },
  descContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  descTitle: {
    fontSize: '24px',
    marginBottom: '15px'
  },
  descText: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#444',
    paddingBottom: '50px'
  },
  starIcon: {
    color: '#ff9800',
    marginRight: '5px'
  }
}; 

function ConcertDetail() {
  const rating = (Math.random() * 2 + 3).toFixed(1);
  const votes = Math.floor(Math.random() * 61) + 40;
  const { concertId } = useParams()
  const [concert, setConcerts] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=> {
    axios.get(`http://localhost:5000/api/concert-details-api/${concertId}`)
    .then(response=> {
        setConcerts(response.data.concert)
        setLoading(false)
    })  
    .catch(err=> {
        setError('Failed to load content')
        setLoading(false)
    })
  },[concertId])

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!concert) return <p>No concert found</p>;

  return (
    <>
    <Userheader/>
    <div style={styles.container}>
      <div style={styles.hero(concert.backgroundImage || concert.concertImage)}>
        <div style={styles.heroContent}>
          <div style={styles.poster}>
            <img
              src={`data:image/jpeg;base64,${concert.concertImage}`}
              alt={concert.concertName}
              style={styles.posterImg}
            />
          </div>
          <div style={styles.info}>
            <h1 style={styles.title}>{concert.concertName}</h1>
            <div style={styles.rating}>
              <span style={styles.starIcon}>★</span>
              <div style={styles.ratingValue}>{rating}/5</div>
              <div style={styles.votes}>({votes} Votes) ›</div>
              <button style={styles.rateBtn}>Rate now</button>
            </div>
            <div style={styles.metadata}>
              <div style={styles.tag}>Live</div>
              <div style={styles.tag}>{concert.venue}</div>
            </div>
            <div style={styles.specs}>
              {new Date(concert.concertDateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })} • {concert.genre} • {concert.ageLimit || 'All Ages'} •{' '}
              {new Date(concert.concertDateTime).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div style={styles.metadata}>
              <div style={styles.tag}>Available Tickets: {concert.availableTickets}</div>
              <div style={styles.tag}>₹{concert.ticketPrice} Onwards</div>
            </div>
            <a href={`/concertbooking/${concertId}`} style={styles.bookBtn}>Book Tickets</a>
          </div>
        </div>
        <button style={styles.shareBtn}>⤴</button>
      </div>
      <div style={styles.descContainer}>
        <h2 style={styles.descTitle}>About the Concert</h2>
        <p style={styles.descText}>{concert.concertDescription}</p>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ConcertDetail;
