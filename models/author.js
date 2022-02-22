let mongoose = require('mongoose');
let Schema = mongoose.Schema;

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
        lifespan_string = this.date_of_birth.getYear().toString();
    }

    lifespan_string += ' - ';

    if (this.date_of_death) {
        lifespan_string += this.date_of_death.getYear().toString();
    }

    return lifespan_string;
});

AuthorSchema.virtual('url').get( () => {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
