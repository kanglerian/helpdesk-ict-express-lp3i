const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User, RefreshToken } = require('../models');
const verifyapikey = require('../middlewares/verifyapikey');
const verifytoken = require('../middlewares/verifytoken');

const { JWT_SECRET, JWT_SECRET_REFRESH_TOKEN, JWT_ACCESS_TOKEN_EXPIRED, JWT_REFRESH_TOKEN_EXPIRED } = process.env;

/* POST Auth */
router.post('/login', verifyapikey, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
      }
    });

    if(!user){
      return res.status(401).json({
        message: 'Account not found!'
      });
    }

    const payload = {
      uuid: user.uuid,
      name: user.name,
      role: user.role,
    }
    
    const token = jwt.sign({ data: payload }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
    const refreshToken = jwt.sign({ data: payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

    await RefreshToken.create({
      refresh_token: refreshToken,
      user_id: user.id
    });

    res.cookie('refreshTokenHelpdeskICT', refreshToken, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      token: token,
      message: 'Login successful!'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'An error occurred on the server. Please try again later.'
    });
  }
});

router.get('/token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshTokenHelpdeskICT;
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid token'
      });
    }

    const refresh = await RefreshToken.findOne({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!refresh) {
      return res.status(400).json({ message: 'Refresh token not found.' });
    }

    jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: error.message });
      }
      const token = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      return res.status(200).json(token);
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshTokenHelpdeskICT;
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'invalid token'
      });
    }

    const refresh = await RefreshToken.findOne({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!refresh) {
      return res.status(400).json({ message: 'Refresh token not found.' });
    }

    jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: error.message });
      }
      const token = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
      return res.status(200).json(token);
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/logout', verifytoken, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshTokenHelpdeskICT;
    if (!refreshToken) {
      return res.status(400).json({ message: 'No refresh token provided' });
    }

    const user = await User.findOne({
      where: {
        uuid: req.user.data.uuid
      }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const refresh = await RefreshToken.findOne({
      where: {
        refresh_token: refreshToken,
        user_id: user.id 
      }
    });

    if (!refresh) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    await RefreshToken.destroy({
      where: { refresh_token: refreshToken }
    });
    
    res.clearCookie('refreshTokenHelpdeskICT');
    return res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
