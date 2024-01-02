const express_rate_limit = require('express-rate-limit');


function limiter(limit, minutes) {
    return express_rate_limit.rateLimit({
        limit: limit,
        windowMs: minutes * 60 * 1000,
        message: `Too many requests from this IP, please try again in ${minutes} minutes`
    })
}

// Example usage:
// router.get('/users', roleAuth(['admin']), async (req, res) => {}

module.exports = limiter;