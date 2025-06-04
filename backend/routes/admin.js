var express = require('express');
const Concert = require('../model/concertModel');
const Booking = require('../model/bookingModel');
const User = require('../model/userModel');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const { isAdmin } = require('./customValidators')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', isAdmin, (req, res) => {
  res.render('admin/admin-panel')
})

router.get('/view-concerts', isAdmin, (req, res) => {
  Concert.find().then((data) => {
    res.render('admin/view-concerts', { data: data })
  })
})

router.get('/add-concert', isAdmin, (req, res) => {
  res.render('admin/add-concert');
});

router.post('/add-concert', upload.single('concertImage'), isAdmin, async (req, res) => {

  try {

    const { concertName, concertDateTime, venue, ticketPrice, availableTickets, concertDescription } = req.body

    const concertImage = req.file.buffer.toString('base64')

    if (!concertName || !concertDateTime || !venue || !ticketPrice || !availableTickets || !concertDescription || !concertImage) {
      return res.status(400).send('All fields are required')
    }

    let newConcert = new Concert({
      concertName,
      concertDateTime,
      venue,
      ticketPrice,
      availableTickets,
      concertDescription,
      concertImage
    })

    await newConcert.save()
    console.log('Concert saved succesfully')
    res.redirect('/admin/view-concerts')
  }
  catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
})

router.get('/update-concert/:id', isAdmin, (req, res) => {
  let concertId = req.params.id
  Concert.findById(concertId).then((data) => {
    res.render('admin/update-concert', { concert: data })
  })
})

router.post('/update-concert/:id', upload.single('concertImage'), isAdmin, async (req, res) => {
  try {

    const { concertName, concertDateTime, venue, ticketPrice, availableTickets, concertDescription } = req.body
    let concertId = req.params.id

    let concert = await Concert.findById(concertId)
    if(!concertId) {
      return res.status(404).send('concert not found')
    }

    let concertImage = concert.concertImage

    if(req.file) {
      concertImage = req.file.buffer.toString('base64')
    }

    if (!concertName || !concertDateTime || !venue || !ticketPrice || !availableTickets || !concertDescription ) {
      return res.status(400).send('All fields are required')
    }

    await Concert.findByIdAndUpdate(concertId, {
      concertName,
      concertDateTime,
      venue,
      ticketPrice,
      availableTickets,
      concertDescription,
      concertImage
    })

    console.log('Concert updated successfully')
    res.redirect('/admin/view-concerts')
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal error')
  }
})

router.get('/delete-concert/:id', isAdmin, (req, res) => {
  let concertId = req.params.id
  Concert.findByIdAndDelete(concertId)
    .then(() => {
      console.log('Concert deleted successfully')
      res.redirect('/admin')
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Internal server error')
    })
})

router.get('/view-users', isAdmin, (req, res) => {
  User.find({ role: { $ne: 'admin' } }).then((data) => {
    res.render('admin/view-users', { users: data })
  })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Internal server error')
    })
})

router.get('/:userId/bookings', isAdmin, async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);
  const bookings = await Booking.find({ userId }).populate('concertId').sort({ bookingTime: -1 });

  res.render('admin/view-user-bookings', { user, bookings });
});

router.get('/all-bookings', isAdmin, async (req, res) => {
  Booking.find().populate('concertId').populate('userId').sort({ bookingTime: -1 }).then((data) => {
    res.render('admin/view-bookings', { bookings: data })
  })
})


module.exports = router;
