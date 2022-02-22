let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BookInstanceSchema = new Schema(
    {
        book: {type: Schema.Type.ObjectId, ref: 'Book', required: true},
        imprint: {type: String, required: true},
        status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
        due_back: {type: Date, default: Date.now},
    }
);

BookInstanceSchema.virtual('url').get( () => {
    return '/catalog/bookinstance/' + this._id;
});

modeule.exports = mongoose.model('BookInstance', BookInstanceSchema);

