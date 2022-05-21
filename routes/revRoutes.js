const express = require('express');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const router = express.Router({mergeParams: true});

router.post('/', async (req, res, next) => {
    try{
        const campground = await Campground.findById(req.params.id).populate('reviews');
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully Added the review...');
        res.redirect(`/campgrounds/${req.params.id}`);
    }
    catch(e){
        next(e);
    }
});

router.delete('/:reviewId', async (req, res, next) => {
    try{
        await Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId} });
        await Review.findByIdAndDelete(req.params.reviewId);
        req.flash('success', 'Successfully Deleted the Review...');
        res.redirect(`/campgrounds/${req.params.id}`);
    }
    catch(e){
        next(e);
    }
});

router.use((err, req, res, next) => {
    const {statusCode = '500'} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
});

module.exports = router;