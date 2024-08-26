const taskQueue = require('../queues/taskQueue');
const rateLimiter = require('../utils/rateLimiter');

async function handleTask(req, res) {
    const { user_id } = req.body;
    try {
        await rateLimiter.consume(user_id, 1);
        await taskQueue.add({ user_id });
        res.status(200).send('Task added to the queue');
    } catch (rateLimiterRes) {
        if (rateLimiterRes.remainingPoints === 0) {
            res.status(429).send('Too many requests. Please try again later.');
        } else {
            res.status(500).send('Something went wrong.');
        }
    }
}

module.exports = { handleTask };
