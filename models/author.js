let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const {DateTime} = require('luxon');

let AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        family_name: {type: String, required: true, maxLength: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

AuthorSchema.virtual('name').get( () => {
    let fullName = '';
    if (this.first_name && this.family_name) {
        fullName = this.first_name + ', ' + this.family_name;
    }
    return fullName;
});

AuthorSchema.virtual('lifespan').get( () => {
    let lifespan_string = '';
    if (this.date_of_birth) {
        let dob = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
        lifespan_string = dob;
    }

    lifespan_string += ' - ';

    if (this.date_of_death) {
        let dod = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
        lifespan_string += dod;
    }

    return lifespan_string;
});

AuthorSchema.virtual('url').get( () => {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
