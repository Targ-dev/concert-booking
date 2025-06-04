var express = require('express');
const Concert = require('../model/concertModel');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const { error } = require('console');
const { check, validationResult } = require('express-validator');
const { validateEmail, validatePassword, isUser } = require('./customValidators');
const e = require('express');
const Booking = require('../model/bookingModel');

/* GET home page. */
router.get('/', function (req, res, next) {
  Concert.find().then((data) => {
    res.render('user/show-concerts', { data: data });
  })
});

router.get('/concert/:id', (req, res) => {
  Concert.findById(req.params.id).then((data) => {
    res.render('user/concert-detail', { concert: data });
  })
})

router.get('/signup', (req, res) => {
  res.render('user/signup', { error: null, message: null });
})

router.post('/signup', [validateEmail, validatePassword], async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    const errors = req.validationResult || [];

    const validationResultErrors = validationResult(req);
    if (!validationResultErrors.isEmpty()) {
      errors.push(...validationResultErrors.array());
    }

    if (errors.length > 0) {
      return res.render('user/signup', { error: errors[0].msg, message: null });
    } else {

      if (password !== confirmPassword) {
        return res.render('user/signup', { error: 'Passwords do not match', message: null });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('user/signup', { error: 'Email already exists', message: null });
      }

      const user = new User({ name, email, password, role });
      const validationError = user.validateSync();
      if (validationError) {
        return res.render('user/signup', { error: validationError.message, message: null });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      res.render('user/login', { errors: false, message: 'User created successfully' });
    }
  }
  catch (error) {
    console.error(error);
    res.render('user/signup', { error: 'Internal server error', message: null });
  }
})

router.get('/login', (req, res) => {
  res.render('user/login', { errors: [], message: null });
})

router.post('/login', [validateEmail, validatePassword], (req, res) => {
  const errors = req.validationResult || [];

  const validationResultErrors = validationResult(req);
  if (!validationResultErrors.isEmpty()) {
    errors.push(...validationResultErrors.array());
  }

  if (errors.length > 0) {
    return res.render('user/signup', { error: errors[0].msg, message: null });
  } else {
    const { email, password } = req.body;
    let foundUser = null;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.render('user/login', { errors: ['User not found'], message: null });
        }
        foundUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isMatch) => {
        if (!isMatch) {
          return res.render('user/login', { errors: ['Invalid password'], message: null });
        }

        req.session.userId = foundUser._id;
        req.session.userEmail = foundUser.email;
        req.session.userName = foundUser.name;
        req.session.role = foundUser.role;

        if (foundUser.role === 'admin') {
          return res.redirect('/admin');
        } else {
          return res.redirect('/');
        }

      })
      .catch((error) => {
        console.error(error);
        res.render('user/login', { errors: ['Internal server error'], message: null });
      })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (error) {
      console.error('Logout error:', error);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
});

router.get('/concert-booking/:id', isUser, (req, res) => {
  Concert.findById(req.params.id).then((data) => {
    res.render('user/concert-booking', { concert: data });
  })
})

router.post('/concert-booking/:id', isUser, async (req, res) => {
  const concertId = req.params.id;
  const ticketsCount = parseInt(req.body.ticketsCount);
  const userId = req.session.userId;

  const concertData = await Concert.findById(concertId);

  if (!concertData) {
    return res.status(404).send('Concert not found');
  }

  if (concertData.availableTickets < ticketsCount) {
    return res.status(400).send('Not enough tickets available');
  }

  const totalPrice = (concertData.ticketPrice * ticketsCount) + 50;

  const booking = new Booking({
    userId,
    concertId,
    ticketsCount,
    totalPrice,
    status: 'booked'
  })

  try {
    await booking.save();
  } catch (error) {
    console.error("Error saving booking:", err);
    return res.status(500).send("Error saving booking");
  }
  concertData.availableTickets -= ticketsCount;
  await concertData.save();

  res.redirect(`/booking-confirmation/${booking._id}`);
})

router.get('/booking-confirmation/:id', async (req, res) => {

  const bookingData = await Booking.findById(req.params.id)
  const concert = await Concert.findById(bookingData.concertId);

  res.render('user/booking-confirmation', { 
    booking: bookingData,  
    concert: concert   
  });
})

router.get('/my-bookings', isUser, async (req, res) => {
  try {
    const userId = req.session.userId
    const bookings = await Booking.find({ userId }).populate('concertId').sort({ bookingTime: -1 });

    res.render('user/show-bookings', { bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Error fetching bookings");
  }
}) 

module.exports = router; 
