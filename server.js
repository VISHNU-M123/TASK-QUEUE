const express = require('express');
const cluster = require('cluster');
const os = require('os');
const taskQueue = require('./queues/taskQueue');
const { handleTask } = require('./controllers/taskController');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork();
    });

    console.log(`Master ${process.pid} is running`);
} else {
    const app = express();
    app.use(express.json());

    app.post('/api/v1/task', handleTask);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    process.on('SIGTERM', () => {
        console.log('Shutting down gracefully...');
        taskQueue.close().then(() => {
            console.log('Queue closed.');
            process.exit(0);
        });
    });

    process.on('uncaughtException', (error) => {
        console.error('Uncaught exception', error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}