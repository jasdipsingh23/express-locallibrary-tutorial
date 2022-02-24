let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let {DateTime} = require('luxon');

let BookSchema = new Schema (
    {
        title: {type: String, required: true},
        author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
        summary: {type: String, required: true},
        isbn: {type: String, required: true},
        genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    }
);

BookSchema.virtual('url').get( () => {
    return '/catalog/book/' + this._id;
});

module.exports = mongoose.model('Book', BookSchema);