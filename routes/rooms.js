const express = require('express');
const router = express.Router();
const { Room, Chat } = require('../models');

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

router.post('/', verifyapikey, async (req, res) => {
  try {
    const room = await Room.findOne({
      where: {
        token: req.body.token,
      }
    });
    if (room) {
      return res.status(400).json({
        message: 'Room token already exists!'
      });
    }
    await Room.create({
      name: req.body.name,
      token: req.body.token,
      type: req.body.type,
      secret: req.body.secret,
    });
    return res.json({
      message: 'Room created successfully!'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.patch('/:token', verifyapikey, async (req, res) => {
  try {
    const room = await Room.findOne({
      where: {
        token: req.params.token,
      }
    });
    if (!room) {
      return res.status(400).json({
        message: 'Room not found!'
      });
    }
    await Room.update({
      name: req.body.name,
    }, {
      where: {
        token: req.params.token,
      }
    });
    return res.json({
      message: 'Room updated successfully!'
    });
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
    if (!room) {
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

router.delete('/:token', verifyapikey, async (req, res) => {
  try {
    const room = await Room.findOne({
      where: {
        token: req.params.token,
      }
    });
    if (!room) {
      return res.status(404).json({
        message: 'Room not found!'
      });
    }
    if (room.token === '46150') {
      return res.status(400).json({
        message: 'Cannot delete default room!'
      });
    }
    await Chat.destroy({
      where: {
        token: req.params.token,
      }
    });
    await Room.destroy({
      where: {
        token: req.params.token,
      }
    });
    return res.json({
      message: 'Room & Chat deleted successfully!'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

module.exports = router;
