const ejs = require('ejs');
const fs = require('fs').promises;
const pdf = require('html-pdf-node');
const Booking = require('../model/bookingModel');
const Concert = require('../model/concertModel');
const express = require('express');
const { isUser } = require('./customValidators');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/generate-pdf/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        const concert = await Concert.findById(booking.concertId)

        if (!booking || !concert) {
            return res.status(404).send('Booking or concert not found')
        }

        const template = await fs.readFile('views/user/booking-confirmation.ejs', 'utf-8')

        const html = ejs.render(template, { booking: booking, concert: concert, userName: req.session.user?.name })
        console.log(html)

        const options = { format: 'A4' }

        const pdfBuffer = await pdf.generatePdf({ content: html }, options)

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=booking-confirmation.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error)
        res.status(500).send('Error generating PDF') 
    }
})

router.get('/send-email/:id', async (req, res) => {

    try {
        const booking = await Booking.findById(req.params.id)
        const concert = await Concert.findById(booking.concertId)

        if (!booking) {
            console.log('Booking not found')
            return res.status(404).send('Booking not found')
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
            to: req.session.userEmail,
            subject: 'Booking Confirmation : ' + concert.concertName,
            html: ejs.render(template, { booking, concert, userName: req.session.userName })
        }

        const info = await transport.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        transport.close();
        console.log('Email sent successfully')
        res.status(200).send('Email sent successfully')
    }catch (error) {
        res.status(500).send('Error sending email')
        console.error('Error sending email:', error)
    }
})

module.exports = router;
