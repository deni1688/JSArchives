module.exports = {
    ensureAuthenticated: (req, res, next) =>{
        if (req.isAuthenticated()) {
            return next();
        }
        // req.flash('error_msg', 'Access not authorized. Please login!');
        res.redirect('/users/login');
    }
};