const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');
const Group = require("../models/groups")
const User = require('../models/users.js');


//index route   
router.get('/', async (req, res) => {
	try{
		const foundGroup = await Group.findOne({ name: req.session.group.name })
			.populate(
				{
					path: 'recipes',
				})
			.exec() 
		res.render("recipes/index.ejs", {
			recipes: foundGroup.recipes
		})
	}catch(err){
		res.send(err)
	}

});		
	

//new route   
router.get('/new', async (req, res) => {
	try{
		const foundUser = await User.findOne({ 'username': req.session.username })
		.populate(
				{
						path: 'groups'
					})
				.exec()
				console.log(`RECIPEFOUNDUSER`, foundUser)
		res.render('recipes/new.ejs', {
			groups: foundUser.groups
		})
	}catch(err){
		res.send(err)
	}
});




//show route   
router.get('/:id', async (req, res) => {
	try {
		const foundGroup = await Group.findOne({"recipes": req.params.id})
			.populate({
				path: "recipes",
				match: {_id: req.params.id}
			}).exec()
		res.render("recipes/show.ejs", {
			recipe: foundGroup.recipes[0],
			group: foundGroup
		})
	} catch(err) {
		res.send(err);
	}
});



//create route   
router.post('/', async (req, res) => {
	try {
		const createdRecipe = await Recipe.create(req.body);
		const foundGroup = await Group.findById(req.body.groupId);
		foundGroup.recipes.push(createdRecipe);
		await foundGroup.save();
		console.log(foundGroup);
		res.redirect('/recipes');
	} catch(err) {
		res.send(err);
	}
});




//edit route   
router.get('/:id/edit', async (req, res) => {
	try { 
		const foundUser = await User.findOne({ 'username': req.session.username })
			.populate(
				{
					path: 'groups'
				})
			.exec()
		const foundRecipeGroup = await Group.findOne({"recipes": req.params.id})
			.populate({path: "recipes", match: {_id: req.params.id}})
			.exec()
		res.render("recipes/edit.ejs", {
			recipe: foundRecipeGroup.recipes[0],
			groups: foundUser.groups,
			recipeGroup: foundRecipeGroup
		})	

	} catch(err) {
		res.send(err);
	}
});


//update route   
router.put('/:id', async (req, res) => {
	try{
		const foundGroup = Group.findOne({"recipes": req.params.id})
		const updatedRecipe = Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true})
		const [updateRecipe, findGroup] = await Promise.all([updatedRecipe, foundGroup])
		if (findGroup._id.toString() != req.body.groupId) {
			findGroup.recipes.remove(req.params.id);
			await findGroup.save();
			const newGroup = await Group.findById(req.body.groupId);
			newGroup.recipes.push(updateRecipe);
			const savedNewGroup = await newGroup.save();
			res.redirect('/recipes/' + req.params.id);
		} else {
			console.log('else statement')
			res.redirect('/recipes/' + req.params.id);
		}
	} catch(err) {
		res.send(err);
	}
})

//delete/destroy route 
router.delete('/:id', async (req, res) => {
	try {
		const deletedRecipe = await Recipe.findByIdAndRemove(req.params.id)
		const foundGroup = await Group.findOne({"recipes": req.params.id})
		foundGroup.recipes.remove(req.params.id)
		await foundGroup.save()
		console.log("Check if recipe gone", foundGroup);
		res.redirect("/recipes");
	} catch(err) {
		res.send(err);
	}
})


module.exports = router;
