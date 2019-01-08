# mqtt-stress

> CLI Tool for sending a lot of messages over mqtt for stress testing services

## Install

Install with [npm](https://www.npmjs.com/)

CLI:

```sh
$ npm i -g mqtt-stress
```

API:

```sh
$ npm i mqtt-stress
```

## Usage

CLI:

```sh
$ mqtt-stress -b mqtt://localhost -t topic "message"
```

For more information run `mqtt-stress --help`

API:

```js
var mqttStress = require('mqtt-stress');


var result = mqttStress.stress('mqtt://localhost', 'topic', 'message');

result.events.on('throughput', throughput => {
    console.info(`Throughput: ${throughput}`);
});

result.events.on('error', err => {
    console.error(`Error: ${err}`);
})

setTimeout(() => {
    result.stop()
        .then(() => {
            console.info('Stopped successfully!');
        })
        .catch(err => {
            console.error(`Error while stopping: ${err}`);
        })
}, 1000);
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/Joge97/mqtt-stress/issues)

## Author

**Joge**

* [github](https://github.com/joge97)
* [website](http://application-studios.com/)

## License

Copyright © 2019 [Joge](#Joge)
Licensed under the MIT license.
