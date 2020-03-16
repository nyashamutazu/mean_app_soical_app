const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'we_dont_wish_to_support_arsenal_fc_but_its_not_a_choice');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        next();
    } catch (error){
        res.status(401).json({ message: 'Auth failed'})
    }
};