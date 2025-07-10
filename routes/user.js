const express = require('express');
const router = express.Router();
const User = require('../models/user');
const LostItem = require('../models/lostItem');
const FoundItem = require('../models/foundItem');
const Comment = require('../models/comment'); 

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const lostItems = await LostItem.find({ user: user._id });
    const foundItems = await FoundItem.find({ user: user._id });

    const itemIds = [...lostItems, ...foundItems].map(item => item._id);
    const comments = await Comment.find({ itemId: { $in: itemIds } }).populate('user');

    res.render('userProfile', {
      user,
      lostItems,
      foundItems,
      comments 
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/');
  }
});

module.exports = router;
