const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { UUIDV4 } = require('sequelize');

const verifyapikey = require('../middlewares/verifyapikey');

/* GET users listing. */
router.get('/', verifyapikey, async (req, res) => {
  try {
    const users = await User.findAll();
    if(!users){
      return res.status(404).json({
        message: 'No account found.'
      });
    }
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

/* GET user listing. */
router.get('/auto', verifyapikey, async (req, res) => {
  try {
    const users = await User.findOne({
      where: {
        role: "S"
      },
      attributes: ["username", "password"]
    });
    if(!users){
      return res.status(404).json({
        message: 'No account found.'
      });
    }
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

/* POST create user. */
router.post('/', verifyapikey, async (req, res) => {
  try {
    if (!req.body.username || !req.body.email) {
      return res.status(400).json({
        message: 'Username and email are required.'
      });
    }
    const user = await User.create(req.body);
    return res.status(201).json({
      message: 'User successfully created!',
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});


module.exports = router;
