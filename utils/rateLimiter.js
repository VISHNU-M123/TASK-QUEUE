const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 20,
    duration: 60,
    blockDuration: 0
});

module.exports = rateLimiter;