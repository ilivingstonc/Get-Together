const express = require('express');
const router = express.Router();
const List = require('../models/lists.js');
const Group = require('../models/groups.js');
const User = require('../models/users.js');

//LIST INDEX   
router.get('/', async (req, res) => {
    try {
        // console.log(`REQ.SESSION.GROUP`, req.session.group)
        const foundGroup = await Group.findOne({ name: req.session.group.name })
            .populate(
                {
                    path: 'lists',
                })
            .exec()               
        
        // const foundList = await List.find({});
        // console.log(`FOUND GROUP`, foundGroup)
        // console.log(`FOUND LIST`, foundList)

        res.render('lists/index.ejs', {
            list: foundGroup.lists
        });
    } catch (err) {
        res.send(err);
    }
});

//LIST NEW
router.get('/new', async (req, res) => {
    try {

        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'groups'
                })
            .exec()

        // const allGroups = await Group.find()

                // console.log(`FOUNDUSERS GROUPS`, foundUser)
                // console.log(`ALL GROUPS`, allGroups)

        res.render('lists/new.ejs', {
            groups: foundUser.groups
        });
    } catch (err) {
        res.send(err);
    }
});

//LIST SHOW    
router.get('/:id', async (req, res) => {
    try {
        const foundGroup = await Group.findOne({ 'lists': req.params.id })
            .populate(
                {
                    path: 'lists',
                    match: { _id: req.params.id }
                })
            .exec()
            res.render('lists/show.ejs', {
                list: foundGroup.lists[0],
                group: foundGroup
            })


    } catch (err) {
        res.send(err);
    }
});

//LIST CREATE   
router.post('/', async (req, res) => {
    try {
        const separatedItems = req.body.items.split(',');
        // console.log()
        const newList = {
            title: req.body.title,
            items: separatedItems,
            dueDate: req.body.dueDate
        };
        const createdList = await List.create(newList);

        const foundGroup = await Group.findById(req.body.groupId);

        foundGroup.lists.push(createdList)
        await foundGroup.save();
        console.log(`NEW LIST IN GROUP`, foundGroup)
        res.redirect('/lists');
    } catch (err) {
        res.send(err);
    } 
});

//LIST EDIT
router.get('/:id/edit', async (req, res) => {
    try {
        const foundUser = await User.findOne({ 'username': req.session.username })
            .populate(
                {
                    path: 'groups'
                })
            .exec()

        // console.log(`FOINDUSER.groups`, foundUser)
        const foundListGroup = await Group.findOne({ 'lists': req.params.id })
            .populate({ path: 'lists', match: { _id: req.params.id } })
            .exec()
            
        res.render('lists/edit.ejs', {
            list: foundListGroup.lists[0],
            groups: foundUser.groups,
            listGroup: foundListGroup
        });
        // const foundList = await List.findById(req.params.id);
        // res.render('lists/edit.ejs', {
        //     list: foundList
        // });
        // console.log(foundList);
    } catch (err) {
        res.send(err);
    }
});


//LIST UPDATE   
router.put('/:id', async (req, res) => {
    try {
        const foundGroup = Group.findOne({ 'lists': req.params.id });
        // console.log(`FOUND GROUP`, foundGroup)

        // const trimmedItems = req.body.items.replace(/\s+/g, '');
        // console.log(`TRIMMED`, trimmedItems);
        const separatedItems = req.body.items.split(',');
        const newList = {
            title: req.body.title,
            items: separatedItems,
            dueDate: req.body.dueDate
        }
        // console.log(`NEWLIST`, newList)
        // console.log(`REQBODY`, req.body)
        const updatedList = List.findByIdAndUpdate(req.params.id, newList, { new: true }) 
        const [updateList, findGroup] = await Promise.all([updatedList, foundGroup])
        // console.log(`UpdateList`, updateList)
        // console.log(`findgroup`, findGroup)

        if (findGroup._id.toString() != req.body.groupId) {
            findGroup.lists.remove(req.params.id);
            await findGroup.save();
            const newGroup = await Group.findById(req.body.groupId);
            newGroup.lists.push(updateList);
            const savedNewGroup = await newGroup.save();
            res.redirect('/lists/' + req.params.id);
        } else {
            console.log('else statement')
            res.redirect('/lists/' + req.params.id);
        }
    } catch (err) {
        res.send(err);
    }
});

//LIST DELETE   
router.delete('/:id', async (req, res) => {
    try {
        const deletedList = await List.findByIdAndRemove(req.params.id);
        const foundGroup = await Group.findOne({ 'lists': req.params.id });
        foundGroup.lists.remove(req.params.id);
        await foundGroup.save()
        console.log(`CHECK IF LISTS GONE`, foundGroup)
        res.redirect('/lists');
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
