const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const userSchema = require('../schemas/userSchema');
const User = mongoose.model('User', userSchema);

//signup
router.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;
    
    if (!name || !username || !email || !password) {
		return res.status(400).json('incorrect form submission');
    }

    let user = await User.findOne({ email });
    if (user) return res
		.status(400)
		.json({ message: 'Wrong info or already registered.' });
    
    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({
        name, username, email, password: hash
    });

	newUser
		.save()
		.then((data) => {
			if (data) {
				res.status(200).json({
					message: 'successfully signed-up',
				});
			} else {
				res.status(400).json({ message: 'something is wrong' });
			}
		})
        .catch((err) => {
            console.log(err);
            res.status(400).json({message: 'Something is wrong with your request. Please Try again!'});
        });
});

//login
router.post('/login', (req, res) => {

    const {email, password } = req.body;

    User.find({ email })
        .then((user) => {
            if (user && user.length > 0) {
                const isValid = bcrypt.compareSync(password, user[0].password);

                if (isValid) {
                    //generate token and send
                    const token = jwt.sign(
                        {
                            username: user[0].username,
                            userId: user[0]._id,
                        },
                        config.JWT_SECRET, {
                        expiresIn: '1h'
                    }
                    );
                    return res.status(200).json({
                        message: 'login Successful',
                        user: user[0],
                        access_token: token,
                    });
                } else {
                    return res.status(400).json({ message: 'User Validation Failed' });
                }
            } else {
                return res.status(400).json({ message: 'Authentication Failed' });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({
				message:
					'Something is wrong with your request. Please Try again!',
			});
        });
   
});


module.exports = router;
