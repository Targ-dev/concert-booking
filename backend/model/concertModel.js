const mongoose = require('mongoose');

const concertSchema = mongoose.Schema({
    concertName : String,
    concertDateTime : Date,
    venue : String,
    ticketPrice : Number,
    availableTickets : Number,
    concertImage : String,
    concertDescription : String
});

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;