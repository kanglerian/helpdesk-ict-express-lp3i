const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const moment = require('moment-timezone');
const { Chat } = require('../models');
const { Op } = require('sequelize');

const verifyapikey = require('../middlewares/verifyapikey');

/* GET chats listing. */
router.get('/', verifyapikey, async (req, res) => {
  try {
    return res.send('Helpdesk Chat 🇮🇩');
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.get('/download/:token', async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: {
        token: req.params.token,
        role_sender: 'S'
      }
    });
    if (!chats.length > 0) {
      return res.status(404).json({
        message: `Message based on token ${req.params.token} not found!`
      });
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Report of Helpdesk`);
    sheet.addRow(['No.', 'Room', 'Token', 'Sender', 'Message', 'Datetime']);

    chats.forEach((result, index) => {
      const time = moment(result.createdAt).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      sheet.addRow([
        index + 1,
        `${result.client}`,
        `${result.name_room} (${result.token})`,
        `${result.name_sender}`,
        `${result.message}`,
        `${time}`,
      ]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="report-helpdesk.xlsx"');

    const buffer = await workbook.xlsx.writeBuffer();
    return res.send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.get('/admin/:token', verifyapikey, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: {
        token: req.params.token
      }
    });
    if (!chats.length > 0) {
      return res.status(404).json({
        message: `Message based on token ${req.params.token} not found!`
      });
    }
    return res.json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.get('/student/:token/:room', verifyapikey, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: {
        token: req.params.token,
        [Op.or]: [
          {
            reply: req.params.room,
          }, {
            client: req.params.room,
          },
        ]
      }
    });
    if (!chats.length > 0) {
      return res.status(404).json({
        message: `Message for token ${req.params.token} not found!`
      });
    }
    return res.json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.get('/dashboard/:token', verifyapikey, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: {
        token: req.params.token,
        role_sender: 'S'
      }
    });
    if (!chats.length > 0) {
      return res.status(404).json({
        message: `Message with token ${req.params.token} not found!`
      });
    }
    return res.json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.delete('/:token', verifyapikey, async (req, res) => {
  try {
    await Chat.destroy({
      where: {
        token: req.params.token,
      }
    });
    return res.json({
      message: `Message with token ${req.params.token} has been successfully deleted!`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

module.exports = router;
