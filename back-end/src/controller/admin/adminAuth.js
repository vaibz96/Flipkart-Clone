const User = require('../../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec((error, user) => {
        if(error) return res.status(400).json({ error })
        if(user) return res.status(200).json({
            message: "Admin already exist",
        });

        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;

        const _user = new User({ 
            firstName, 
            lastName, 
            email, 
            password,
            username: Math.random().toString(), 
            role: 'admin'
        });

        _user.save((error, data) => {
            if (error){
                return res.status(400).json({
                    message: 'Could not save',
                });
            }

            if(data){
                return res.status(201).json({
                    message: "Admin Created Successfully... !",
                })
            }
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
    .exec((error, user) => {
        if(error) return res.status(400).json({ error })
        if(user) {
            if(user.authenticate(req.body.password) && user.role === 'admin') {
                const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '2h'});
                const { _id, firstName, lastName, email, role, fullName } = user;
                res.status(200).json({
                    token,
                    user: {
                        _id,
                        firstName, 
                        lastName, 
                        email, 
                        role, 
                        fullName
                    }
                });
            } else {
                return res.status(401).json({
                    message: "Authorization Failed"
                });
            }

        } else {
            return res.status(400).json({
            message: "Something went wrong"
            });
        }
    })
};

exports.requireSignIn = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
};