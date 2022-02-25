const mongoose = require('mongoose');

const Save = mongoose.Schema({
    filename: String,
    data: String
})
module.exports = mongoose.model('Save',Save);