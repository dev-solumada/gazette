const mongoose = require('mongoose');

const PdfDone = mongoose.Schema({
    name: String,
    treated_by: String,
})
module.exports = mongoose.model('PdfDone',PdfDone);