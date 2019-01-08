#!/usr/bin/env node
import * as commander from 'commander';

import {stress} from './stress';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');


commander
    .version(pkg.version)
    .description('CLI Tool for sending a lot of messages over mqtt for stress testing services.')
    .arguments('<message>')
    .option('-b, --brokerUrl <brokerUrl>', 'Broker URL')
    .option('-t, --topic <topic>', 'Topic')
    .option('-m, --maxThroughput <maxThroughput>', 'Max throughput')
    .option('-q, --qos <qos>', 'QOS')
    .action((message, {brokerUrl, topic, maxThroughput, qos}) => {
        const {events} = stress(brokerUrl, topic, message, {maxThroughput, qos});

        events.on('throughput', throughput => {
            console.info(`Throughput: ${throughput}`);
        });

        events.on('error', err => {
            console.error(`Error: ${err}`);
        });
    })
    .parse(process.argv);
