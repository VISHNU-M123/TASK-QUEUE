const Bull = require('bull');
const logger = require('../utils/logger');

const taskQueue = new Bull('task-queue');

taskQueue.process(async (job) => {
    const { user_id } = job.data;
    await task(user_id);
});

async function task(user_id) {
    const timestamp = Date.now();
    console.log(`${user_id} - task completed at - ${timestamp}`);
    logger.info({ user_id, timestamp });
}

module.exports = taskQueue;