const mongoose = require('mongoose');

//Recipe schema
const recipeSchema = new mongoose.Schema({

	//recipe title, for example "Gma's Turkey Stuffing"
	//required - no unlabeled recipes...
	title: {type: String, required: true},

	//ingredients array - (1cup milk, 2 cups sugar)
	//Not required - some users may
	//want to type out all instructions in body.

	//change this to array once routes are working.
	ingredients: String,
	

	//instructions go here. Required.
	instructions: {type: String, required: true},

	//comments, could be changed to 'likes?'
	//not required.
	comments: String
});


//modal
const Recipe = mongoose.model('Recipe', recipeSchema);
//exporting
module.exports = Recipe;