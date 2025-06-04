const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
   userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
   },
   
   concertId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Concert',
    required : true
   },

   ticketsCount : {
    type : Number,
    required : true,
    Min : 1,
    Max : 3
   },

   bookingTime : {
    type : Date,
    default : Date.now
   },

   totalPrice : {
    type : Number,
    required : true
   },

   status : {
    type : String,
    enum : ['pending','booked', 'cancelled'],
    default : 'booked'
   }
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking