# DC/OS Metronome client

Implements some of the REST API http methods of the [Methonome API](http://dcos.github.io/metronome/docs/generated/api.html)

[![Build Status](https://travis-ci.org/FanMilesGmbH/dcos-metronome-client.svg?branch=master)](https://travis-ci.org/FanMilesGmbH/dcos-metronome-client)

Example usage:

```javascript

const metronomeClient = require('dcos-metronome-client').getInstance('http://metronome.mesos:9000');

const jobPayload = {
    id: 'test-' + (new Date()).getTime(),
    run: {
        env: {
            TEST1: 'test',
            TEST: 'test'
        },
        artifacts: [{
            uri: 'file:///home/core/docker.tar.gz',
            extract: true,
            executable: false,
            cache: false
        }],
        cpus: 0.01,
        mem: 32,
        disk: 0,
        docker: {
            image: 'busybox'
        }
    }
};

yield metronomeClient.createJob(jobPayload);

```
