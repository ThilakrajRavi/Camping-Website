const Review = require('./review');

const mongoose = require('mongoose');

const yelpCampSchema = mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

yelpCampSchema.post('findOneAndDelete', async function (doc) {
   if(doc){
       await Review.deleteMany({
           _id: {
               $in: doc.reviews         // it will search the id in reviews array
           }
       })
   } 
});

const campModel = mongoose.model('Campground', yelpCampSchema);

module.exports = campModel;