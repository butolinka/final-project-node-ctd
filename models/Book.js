const { default: mongoose } = require('mongoose');
const mongoos = require('mongoose');

const BookSchema = new mongoos.Schema({
    title: { type: String, required: true},
    author: { type: String, required: true},
    description: { type: String},
    user: { type: mongoos.Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Book', BookSchema);