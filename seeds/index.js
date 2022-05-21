const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp-new', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const names = array => array[Math.floor(Math.random() * array.length)];

const seeds = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const randomNum = Math.floor(Math.random() * 1000);
        const priceRandom = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            name: `${names(descriptors)} ${names(places)}`,
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            image: 'https://source.unsplash.com/collection/190727',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi voluptatum consectetur, cum accusantium natus provident voluptate! Temporibus consectetur quam laborum minima, excepturi amet, laudantium ratione, quaerat provident quia aut vero!',
            price: priceRandom,
            author: '611cb6c232d6ef4200c4bf3f'
        });
        await camp.save();
    }
}

seeds()
.then(() => {
    mongoose.connection.close();
});
