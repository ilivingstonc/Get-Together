const express = require('express');
const router = express.Router();
const Group = require("../models/groups");
const User = require("../models/users");

//ROUTES

//index route  need to make sure it finds only the CURRENT users groups
router.get('/', async (req, res) => {
    try {
        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'groups',
                    match: { _id: req.params.id }
                })
            .exec()
        // console.log(`FOUND USER`, foundUser)


        // const foundGroups = await Group.find({}); //not needed?
        res.render('groups/index.ejs', {
            groups: foundUser.groups,
            username: req.session.username,
            message: req.session.message,
            logged: req.session.logged
        });
    } catch (err) {
        res.send(err);
    }
});


//new route  DONE
router.get('/new', (req, res) => {
    res.render('groups/new.ejs');
});


//create route DONE and pushes group into current users groups array
router.post('/', async (req, res) => {
    try {
        const findUser = await User.findOne({'username': req.session.username});
        const createGroup = await Group.create(req.body);
        findUser.groups.push(createGroup);
        await findUser.save();
        console.log(`FINDUSER CHECK FOR GROUPS ARRAY`, findUser)
        res.redirect('/groups');
    } catch (err) {
        res.send(err);
    }
});


//show route  WORKING
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'groups',
                    match: { _id: req.params.id }
                })
            .exec()
        // below adds current group to req
        req.session.group = foundUser.groups[0]
        // console.log(`req.session`, req.session)
        // console.log(`req.session.GROUP`, req.session.group)
        res.render('groups/show.ejs', {
            user: foundUser,
            group: foundUser.groups[0],
        });
        // console.log(foundUser)
    } catch (err) {
        res.send(err);
    }
});


//edit route
router.get('/:id/edit', async (req, res) => {
    try {
        const allUsers = await User.find({})
        const foundGroupUser = await User.findOne({ 'groups': req.params.id })
            .populate({ path: 'groups', match: { _id: req.params.id } })
            .exec()
        res.render('groups/edit.ejs', {
            group: foundGroupUser.groups[0],
            users: allUsers,
            groupUser: foundGroupUser
        });
    } catch (err) {
        res.send(err);
    }
});


//update route
router.put('/:id', async (req, res) => {
    try {
        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const foundUser = await User.findOne({ 'groups': req.params.id });
        
            res.redirect('/groups/' + req.params.id);
        // }
    } catch (err) {
        console.log(err)
        res.send(err);
    }
});


//destroy route DONE
router.delete('/:id', async (req, res) => {
    try {
        const deleteGroup = await Group.findByIdAndRemove(req.params.id);
        const findUser = await User.findOne({ 'username': req.session.username });
        console.log(findUser, ' found user')
        findUser.groups.remove(req.params.id);
        await findUser.save()
        console.log(findUser)
        res.redirect('/groups')
    } catch (err) {
        res.send(err);
    }
});




module.exports = router;
