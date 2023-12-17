// A Middleware to check the user role and grant access to the route

function roleAuth(roles) {
    return [
        (req, res, next) => {
            if (roles.includes(req.currentUser.type)) {
                next();
            } else {
                res.status(403).json({message: 'Forbidden'});
            }
        },
    ];
}

// Example usage:
// router.get('/users', roleAuth(['admin']), async (req, res) => {}

module.exports = roleAuth;