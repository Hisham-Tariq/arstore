const jwt = require('express-jwt');
const UserModel = require('../models/user');

function authJwt(req, res, next) {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    const tempMiddle = (req, res, next) => {
        console.log(req.headers)
        next()
    };
    const jwtMiddleware = jwt({
        secret,
        algorithms: ['HS256'],
//        isRevoked: isRevoked,
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/auth/register`,
            `${api}/auth/login`,
            `${api}/csrf-token`,
        ]
    })

    // Custom middleware function to fetch user details
    const fetchUserDetails = async (req, res, next) => {
        try {
            if (req.user) {
                const userId = req.user.userId; // Assuming your JWT payload has a userId field
                const user = await UserModel.findById(userId);

                if (!user) {
                    // Handle the case where the user is not found in the database
                    return res.status(404).json({message: 'User not found'});
                }

                // Add user details to the request for further use in route handlers
                req.currentUser = user;
            }

            next();
        } catch (error) {
            // Handle errors, e.g., database connection issues, etc.
            res.status(500).json({error: error.message});
        }
    };

    return [jwtMiddleware, fetchUserDetails];
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt;