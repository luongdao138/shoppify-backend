const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  signup: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (user) return res.status(400).json('Username already exists!');

      const salt = await bcrypt.genSalt(10);
      const hashPw = await bcrypt.hash(password, salt);

      let newUser = new User({
        username,
        password: hashPw,
      });

      newUser = await newUser.save();
      jwt.sign({ _id: newUser._id }, process.env.ACCESS_KEY, (error, token) => {
        if (error) return res.status(500).json('Server error!');

        return res.json({
          user: newUser,
          token,
        });
      });
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json('Username does not exists!');

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return res.status(400).json('Password does not correct!');

      jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, (error, token) => {
        if (error) return res.status(500).json('Server error!');

        return res.json({
          user,
          token,
        });
      });
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
  getUser: async (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.ACCESS_KEY, async (error, decoded) => {
      if (error) {
        return res.status(400).json('Token invalid');
      }
      const { _id } = decoded;

      const user = await User.findById(_id);
      if (!user) return res.status(400).json('User not found!');

      return res.json({
        user,
        token,
      });
    });
  },
};
