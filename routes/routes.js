const router = require("express").Router();
const User = require("../models/User");
const Joi = require("@hapi/joi");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/login', async (req,res) => {
     // validates
     const { error } = schemaLogin.validate(req.body);
     if (error) return res.status(400).json({ error: error.details[0].message }) 
     const user = await User.findOne({email: req.body.email});
     if(!user) return res.status(400).json({error: true, message: 'Usuario no registrado'});

     const passValid = await bcrypt.compare(req.body.password, user.password); 
     if(!passValid) return res.status(400).json({error: true, message: 'Contraseña inválida'});

     const token = jwt.sign({
         name: user.name,
         id: user._id
     }, process.env.TOKEN_SECRET)

     res.json({
         error: null,
         message: 'Bienvenido',
         token: token
     })

})

router.post("/register", async (req, res) => {

  //validate user
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({error: error.details[0].message,});
  }

  const emailExists = await User.findOne({email: req.body.email});
  if(emailExists) return res.status(400).json({
    error: true, message: 'El email ingresado ya está registrado'
  });

  //hash password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: password
  });
  try {
    const userDB = await user.save();
    res.json({
      error: null,
      data: userDB,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
