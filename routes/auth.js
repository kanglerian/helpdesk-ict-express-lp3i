const express = require('express');
const router = express.Router();
const { User } = require('../models');

const verifyapikey = require('../middleware/verifyapikey');

/* POST Auth */
router.post('/login', verifyapikey, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
        role: 'S'
      }
    });
    if(!user){
      return res.status(401).json({
        message: 'Account not found!'
      });
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.post('/admin/login', verifyapikey, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
        role: 'A'
      }
    });
    if(!user){
      return res.status(401).json({
        message: 'Account not found!'
      });
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

module.exports = router;
