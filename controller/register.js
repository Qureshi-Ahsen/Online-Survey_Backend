const User = require('../models/user');
const apiresponse = require('../helper/response');

const userRegister = {
  async register(req, res) {
   
    try {
      const { name, email, password } = req.body;

      if (!name || name.trim() === '') {
        res.status(400).send('Please enter name');
        return;
      }

      if (!email || email.trim() === '') {
         res.status(400).send('Please enter email');
         return;
      }

      if (!password || password.trim() === '') {
         res.status(400).send('Please enter password');
         return;
      }

      const user = await User.findOne({ email }, { _id: 1 });

      if (user) {
        res.status(500).send({ error: 'User already exists' });
        return;
      }

      const hashedPassword = await apiresponse.hashedpassword(password);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword
      });

       apiresponse.successResponseWithData(res, newUser, 'Successfully registered');
       return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userRegister;