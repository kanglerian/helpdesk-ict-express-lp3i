const express = require('express');
const router = express.Router();
const { Room } = require('../models');

const verifyapikey = require('../middlewares/verifyapikey');

/* GET rooms listing. */
router.get('/', verifyapikey, async (req, res) => {
  try {
    const rooms = await Room.findAll();
    return res.json(rooms);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

/* GET rooms listing. */
router.get('/:token', verifyapikey, async (req, res) => {
  try {
    const room = await Room.findOne({
      where: {
        token: req.params.token,
      }
    });
    if(!room){
      return res.status(404).json({
        message: 'Room not found!'
      });
    }
    return res.json(room);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

module.exports = router;
