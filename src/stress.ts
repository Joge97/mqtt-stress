import * as mqtt from 'async-mqtt';
import {EventEmitter} from 'events';


export interface StressOptions {
    qos?: 0 | 1 | 2;
    maxThroughput?: number;
}

export interface StressResult {
    // NOTE: Emits the throughput per second ('throughput') and errors ('error')
    events: EventEmitter;
    stop: () => Promise<void>;
}

export function stress(brokerUrl: string,
                       topic: string,
                       message: string | Buffer,
                       options?: StressOptions): StressResult {
    const client = mqtt.connect(brokerUrl);
    const events = new EventEmitter();

    const qos = options.qos || 0;
    const maxThroughput = options.maxThroughput || 0;
    const throttleThroughput = maxThroughput !== 0;

    let stopped = false;
    let currentThroughput = 0;
    let currentThroughputStartTime = Date.now();

    client.on('connect', async () => {
        while(!stopped) {
            await publish();
        }
    });

    return {
        events,
        stop: async () => {
            stopped = true;
            await client.end();
        }
    };

    async function publish(): Promise<void> {
        if(throttleThroughput && currentThroughput >= maxThroughput) {
            currentThroughput = maxThroughput;
        } else {
            try {
                await client.publish(topic, message, {qos});
            } catch(err) {
                events.emit('error', err);
            }
        }

        currentThroughput++;

        const now = Date.now();

        if(now > (currentThroughputStartTime + 1000)) {
            events.emit('throughput', currentThroughput);
            currentThroughput = 0;
            currentThroughputStartTime = now;
        }
    }
}
