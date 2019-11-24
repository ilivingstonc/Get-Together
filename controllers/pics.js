const express = require('express');
const router = express.Router();
const Pic = require('../models/pics.js');
const Group = require('../models/groups.js');
const User = require('../models/users.js');

//WIP
//Pics INDEX   
router.get('/', async (req, res) => {
    try {
        const foundGroup = await Group.findOne({ name: req.session.group.name })
            .populate(
                {
                    path: 'pics',
                })
            .exec() 
        res.render('pics/index.ejs', {
            pic: foundGroup.pics
        });
    } catch (err) {
        res.send(err);
    }
});

//Pics NEW   
router.get('/new', async (req, res) => {
    try {
        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'groups'
                })
            .exec()
        // const allGroups = await Group.find()
        res.render('pics/new.ejs', {
            groups: foundUser.groups
        });
    } catch (err) {
        res.send(err);
    }
});



//Pic CREATE   
router.post('/', async (req, res) => {
    try {
        const createdPic = await Pic.create(req.body);
        console.log(`CREATED PIC`, createdPic)

        const foundGroup = await Group.findById(req.body.groupId);
        foundGroup.pics.push(createdPic)
        await foundGroup.save();
        console.log(`ARE THERE PICS IN THE GROUP PICS ARRAY??`, foundGroup)
        res.redirect('/pics');
    } catch (err) {
        res.send(err);
    }
});

//Pic DELETE   
router.delete('/:id', async (req, res) => {
    try {
        const deletedPic = await Pic.findByIdAndRemove(req.params.id);
        const foundGroup = await Group.findOne({ 'pics': req.params.id });
        foundGroup.pics.remove(req.params.id);
        await foundGroup.save()
        console.log(`CHECK IF PICS GONE`, foundGroup)
        res.redirect('/pics');
    } catch (err) {
        res.send(err);
    }
});



module.exports = router;