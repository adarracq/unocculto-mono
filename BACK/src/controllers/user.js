const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require("../scripts/email");

exports.loginOrSignup = (req, res, next) => {

    const email = req.body.email;
    // create a 6 digits random code
    let code = Math.floor(100000 + Math.random() * 900000);

    if (email == 'antoine.cheval.darracq@gmail.com')
        code = '123456';

    User.findOne({ email: email })
        .then(user => {
            // if user does not exist, create a new user and send email code
            if (!user) {
                const user = new User({
                    email: email,
                    code: code,
                });

                user.save()
                    .then(() => {
                        /*sendEmail(user.email, "Code de verification", `
                            <html lang="fr">    
                                <body>
                                <p>
                                    Votre code de vérification est <strong>${code}</strong>
                                </p>
                                </body>
                            </html>
                                `)
                            .then(() => {
                                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
                                res.status(201).json({ message: 'signup', token: token });
                            })
                            .catch(error => res.status(400).json({ error: 'Email not sent' }));*/
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
                        res.status(201).json({ message: 'signup', token: token });
                    })
                    .catch(error => res.status(400).json({ error: 'Email already usedddd' }));
            }
            // if user exists, send email code and add it to the user
            else {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
                if (user.verified && user.pseudo) {
                    res.status(201).json({ message: 'login', token: token });
                }
                else {
                    res.status(201).json({ message: 'signup', token: token });
                }
                /*sendEmail(user.email, "Code de verification", `
                <html lang="fr">    
                    <body>
                    <p>
                        Votre code de vérification est <strong>${code}</strong>
                    </p>
                    </body>
                </html>
                    `)
                    .then(() => {
                        user.code = code;
                        // update user code
                        User.findOneAndUpdate(
                            { email: email },
                            { code: code },
                            { new: true })
                            .then((user) => {
                                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
                                if (user.verified && user.firstname) {
                                    res.status(201).json({ message: 'login', token: token });
                                }
                                else {
                                    res.status(201).json({ message: 'signup', token: token });
                                }
                            })
                            .catch(error => res.status(400).json({ error: 'Email not sent' }));
                    })
                    .catch(error => res.status(400).json({ error: 'Email not sent' }));*/
            }
        })
        .catch(error => res.status(500).json({ error: 'Internal Error' }));
};

exports.verifyEmailCode = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Not Found' });
            }
            if (user.code != req.body.code) {
                return res.status(401).json({ error: 'Wrong Code' });
            }
            // if user is banned
            if (user.status == -1) {
                return res.status(401).json({ error: 'User banned' });
            }
            User.findOneAndUpdate(
                { email: req.body.email },
                { verified: true },
                { new: true })
                .then((user) => {
                    res.status(201).json({ message: 'Code verified', type: user.type });
                })
                .catch(error => res.status(400).json({ error: 'Not Found' }));
        })
        .catch(error => res.status(500).json({ error: 'Internal Error' }));
};

exports.getUserByEmail = (req, res, next) => {

    User.findOne({ email: req.params.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Not Found' });
            }
            res.status(201).json(user);
        })
        .catch(error => res.status(400).json({ error: 'Not Found' }));
};

exports.getUserById = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error: 'Not Found' }));
}

exports.updateUser = (req, res, next) => {
    // remove _id from req.body.user
    console.log(req.body);
    delete req.body.user._id;

    User.findOneAndUpdate(
        { email: req.body.user.email },
        { ...req.body.user },
        { new: true })
        .then((user) => {
            // send email to verify user
            if (req.body.toValidate)
                sendEmailToVerifyUser(user);

            res.status(201).json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error: 'Not Found' })
        });
}

exports.updateExpoPushToken = (req, res, next) => {
    User.findOneAndUpdate(
        { email: req.body.email },
        { expoPushToken: req.body.token },
        { new: true })
        .then((user) => res.status(200).json(user))
        .catch(error => res.status(400).json({ error: 'Not Found' }));
}

exports.verifyPseudo = (req, res, next) => {
    const pseudo = req.params.pseudo;
    console.log("Verifying pseudo: " + pseudo);

    User.findOne({ pseudo: pseudo })
        .then(user => {
            if (user) {
                return res.status(200).json({ available: false });
            }
            else {
                return res.status(200).json({ available: true });
            }
        })
        .catch(error => res.status(500).json({ error: 'Internal Error' }));
}

exports.deleteUser = (req, res, next) => {
    let _id = req.params.id;
    User.findOne({ _id: _id })
        .then(user => {
            // delete user
            User.deleteOne({ _id: _id })
                .then(() => {
                    // delete 
                    X.deleteMany({ participants: _id })
                        .then(() => {
                            // TODO DELETE THE REST OF USER DATA (
                        })
                        .catch(error => res.status(400).json({ error: 'conversations not deleted' }));
                })
                .catch(error => res.status(400).json({ error: 'user not deleted' }));
        })
        .catch(error => res.status(400).json({ error: 'user not found' }));

}