const express = require('express');
const router = express.Router();
const { User, Token } = require('../models');
const { UUIDV4 } = require('sequelize');

const verifyapikey = require('../middlewares/verifyapikey');

router.post('/', verifyapikey, async (req, res) => {
  try {
    const token = await Token.findOne({
      where: {
        token: req.body.token
      }
    });
    if(!token){
      await Token.create({
        token: req.body.token
      });
      return res.json(token);
    } else {
      return res.json({
        message: 'Token already exists.'
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

module.exports = router;
