const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn} = require('../middleware');

router.get('/', async (req, res, next) => {
    try{
        const campsName = await Campground.find({});
        res.render('campgrounds/index', {campsName});
    }
    catch(e){
        next(e);
    }
    
});

router.get('/new',isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/',isLoggedIn, async (req, res, next) => {
    try{
        const campgroundSchema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required().min(0),
             
        }).required()
        const result = campgroundSchema.validate(req.body);

        // if(!req.body.camps) throw new ExpressError('Invalid Campground Data', 400);
        const camps = req.body;
        const campgrounds = new Campground(camps);
        campgrounds.author = req.user._id;
        await campgrounds.save();
        req.flash('success', 'Successfully created a campground...');
        res.redirect(`/campgrounds/${campgrounds._id}`);
    }
    catch(e){
        next(e);
    }
});

router.get('/:id/edit',isLoggedIn, async (req, res, next) => {
    try{
        const {id} = req.params;
        const campId = await Campground.findById(id).populate('reviews');
        if(!campId){
            req.flash('error', 'Campground Not found');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', {campId});
    }
    catch(e){
        next(e);
    }
    
});

router.put('/:id',isLoggedIn, async (req, res, next) => {
    try{
        // if(!req.body.camps) throw new ExpressError('Invalid Campground Data', 400);
        const formData = req.body;
        const {id} = req.params;
    
        const camps = await Campground.findByIdAndUpdate(id, formData);
        req.flash('success', 'Successfully Updated the Campground...');
        res.redirect(`/campgrounds/${id}`);
    }
    catch(e){
        next(e);
    }
    
});

router.get('/:id', async (req, res, next) => {
    try{
        const {id} = req.params;
        const campId = await Campground.findById(id).populate('reviews').populate('author');
        if(!campId){
            req.flash('error', 'Campground Not found');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', {campId});
    }
    catch(e){
        next(e);
    }
    
});

router.delete('/:id',isLoggedIn, async (req, res, next) => {
    try{
        const {id} = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully Deleted the Campground...');
        res.redirect('/campgrounds');
    }
    catch(e){
        next(e);
    }
});

router.use((err, req, res, next) => {
    const {statusCode = '500'} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
})

module.exports = router;