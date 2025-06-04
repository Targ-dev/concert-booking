var express = require('express');
const Concert = require('../model/concertModel');
const Booking = require('../model/bookingModel');
const User = require('../model/userModel');
const path = require('path');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const ejs = require('ejs');
 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const secretKey = 'qwertyzxcvbasdfghjkl'

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET || 'qwertyzxcvbasdfghjkl', (err, decoded) => {
    if (err) {
      console.error('JWT Verify Error:', err.message);
      return res.status(401).json({
        message: 'Invalid or expired token',
        error: err.message
      });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    req.name = decoded.name;
    next();
  });
};

const role = (roles) => {
  return (req, res, next) => {
    console.log("USER ROLE:", req.role)

    if (!req.role) {
      return res.status(403).json({ message: 'Forbidden - No role assigned' });
    }

    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }
    next();
  }
}


router.get('/view-concerts-api', (req, res) => {
  Concert.find().then((data) => {
    res.status(200).json({ data: data })
  })
})

router.get('/concert-details-api/:id', async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }
    res.status(200).json({ concert });
  } catch (error) {
    console.error('Error fetching concert:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup-api', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ name, email, password, role });
    const validationError = user.validateSync();
    if (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user
    });

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/login-api', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'qwertyzxcvbasdfghjkl',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      expiresIn: 3600,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/concert-booking-api', verifyToken, role(['user']), async (req, res) => {
  const concertId = req.body.id;
  const ticketsCount = parseInt(req.body.ticketsCount);
  const userId = req.userId;

  try {
    const concertData = await Concert.findById(concertId);

    if (!concertData) {
      return res.status(404).json({ error: 'Concert not found' });
    }

    if (concertData.availableTickets < ticketsCount) {
      return res.status(400).json({ error: 'Not enough tickets available' });
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
      console.error("Error saving booking:", error);
      return res.status(500).send("Error saving booking");
    }
    concertData.availableTickets -= ticketsCount;
    await concertData.save();

    return res.status(201).json({
      message: 'Booking successful',
      bookingId: booking._id,
      totalPrice,
      ticketsBooked: ticketsCount,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/booking-confirmation-api/:id', verifyToken, async (req, res) => {

  try {
    const bookingData = await Booking.findById(req.params.id)
    const concert = await Concert.findById(bookingData.concertId)
    const user = await User.findById(bookingData.userId)

    if (!bookingData) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    if (bookingData.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorised access' })
    }

    res.status(200).json({
      booking: bookingData,
      concert: concert,
      user: user
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/my-bookings-api', verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId

    const bookings = await Booking.find({ userId }).populate('concertId').sort({ bookingTime: -1 });

    res.status(200).json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
})

router.get('/send-email-api/:id', verifyToken, async (req, res) => {

  try {

    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const userEmail = decoded.email
    const userName = decoded.name

    const booking = await Booking.findById(req.params.id)
    const concert = await Concert.findById(booking.concertId)

    if (!booking) {
      console.log('Booking not found')
      return res.status(404).json({ error: 'Booking not found' })
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "9c11e0596d9844",
        pass: "980d7978d5688e"
      }
    });

    const template = await fs.readFile('views/user/booking-confirmation.ejs', 'utf-8')

    const mailOptions = {
      from: 'concerthub@chub.com',
      to: userEmail,
      subject: 'Booking Confirmation : ' + concert.concertName,
      html: ejs.render(template, { booking, concert, userName })
    }

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    transport.close();
    console.log('Email sent successfully')
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' })
    console.error('Error sending email:', error)
  }
})

// ________________________________________________________________________________________________

router.get('/view-concerts-admin-api', verifyToken, (req, res) => {
  Concert.find().then((data) => {
    res.status(200).json({ data: data })
  })
})

router.get('/view-users-api', verifyToken, (req, res) => {
  User.find({ role: { $ne: 'admin' } }).then((data) => {
    res.status(200).json({ users: data })
  })
})

router.post('/add-concert-api', verifyToken, role(['admin']), upload.single('concertImage'), async (req, res) => {
  const { concertName, concertDateTime, venue, ticketPrice, availableTickets, concertDescription } = req.body
  const concertImage = req.file.buffer.toString('base64')

  console.log(concertName, concertDateTime, venue, ticketPrice, availableTickets, concertDescription)

  if (!concertName || !concertDateTime || !venue || !ticketPrice || !availableTickets || !concertDescription || !concertImage) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
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

    res.status(201).json({
      success: true,
      message: 'Concert added successfully',
      concert: newConcert
    })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.put('/update-concert-api/:id', verifyToken, role(['admin']), upload.single('concertImage'), async (req, res) => {
  const { concertName, concertDateTime, venue, ticketPrice, availableTickets, concertDescription } = req.body
  const concertId = req.params.id

  try {
    let concert = await Concert.findById(concertId)
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' })
    }

    let concertImage = concert.concertImage
    if (req.file) {
      concertImage = req.file.buffer.toString('base64')
    }

    if (concertName !== undefined) concert.concertName = concertName
    if (concertDateTime !== undefined) concert.concertDateTime = concertDateTime
    if (venue !== undefined) concert.venue = venue
    if (ticketPrice !== undefined) concert.ticketPrice = ticketPrice
    if (availableTickets !== undefined) concert.availableTickets = availableTickets
    if (concertDescription !== undefined) concert.concertDescription = concertDescription
    if (concertImage !== undefined) concert.concertImage = concertImage

    await concert.save()

    res.status(200).json({
      success: true,
      message: 'Concert updated successfully',
      concert: concert
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.delete('/delete-concert-api/:id', verifyToken, role(['admin']), async (req, res) => {
  let concertId = req.params.id
  const concert = await Concert.findByIdAndDelete(concertId)

  try {
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' })
    }

    res.status(200).json({ message: 'Concert deleted successfully' })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/:userId/bookings-api', verifyToken, async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);
  const bookings = await Booking.find({ userId }).populate('concertId').sort({ bookingTime: -1 });

  res.status(200).json({
    bookings: bookings,
    user: user
  })
})

router.get('/all-bookings-api', verifyToken, async (req, res) => {
  Booking.find().populate('concertId').populate('userId').sort({ bookingTime: -1 }).then((bookings) => {
    res.status(200).json({ bookings })
  })
})

module.exports = router;