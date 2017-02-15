'use strict';

const Promise = require('bluebird');
const requestSync = require('request');
const request = Promise.promisify(requestSync);

const expect = require('./../chai').expect;

const MetronomeClient = require('../../MetronomeClient.js');

describe('Metronome client (integration)', () => {
    let sut;
    let metronomeBaseUrl;
    let jobPayload;

    beforeEach(() => {
        metronomeBaseUrl = 'http://metronome.mesos:9000';

        sut = new MetronomeClient({
            metronomeBaseUrl,
            httpClient: request
        });
    });

    afterEach(Promise.coroutine(function * () {
        yield sut.removeJob(jobPayload);
    }));

    context('Create a new job', () => {
        let result;

        beforeEach(Promise.coroutine(function * () {
            jobPayload = {
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

            result = yield sut.createJob(jobPayload);
        }));

        it('should contain job id', () => expect(result).to.have.property('id'));
    });

    context('Run an existing job', () => {
        let result;
        let inputPayload;

        beforeEach(Promise.coroutine(function * () {
            jobPayload = {
                id: 'test-' + (new Date()).getTime(),
                run: {
                    cpus: 0.01,
                    mem: 32,
                    disk: 0,
                    docker: {
                        image: 'busybox'
                    }
                }
            };

            yield sut.createJob(jobPayload);

            inputPayload = {
                id: jobPayload.id
            };

            result = yield sut.runJob(inputPayload);
        }));

        it('should contain id', () => expect(result).to.have.property('id'));
        it('should contain job id', () => expect(result).to.have.property('jobId'));
    });
});
