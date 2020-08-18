const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//deciding the fields required for our documents
// category - name

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxlength: 64

    }
    // description: {
    //     type: String,
    //     required: true,
    //     minLength: 3,
    //     maxlength: 1000
    // }
});

// model names - should be singular and should be in pascal case

const Category = mongoose.model('Category', categorySchema);

module.exports = {
    Category
}
// let c1 = new Category({name: 'Sports'});
// c1.save();