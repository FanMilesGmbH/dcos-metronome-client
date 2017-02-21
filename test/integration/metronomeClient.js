'use strict';

const Promise = require('bluebird');

const expect = require('./../chai').expect;

const metronomeBaseUrl = 'http://metronome.mesos:9000';
const sut = require('../../index.js').getInstance(metronomeBaseUrl);

function getRandomJobName() {
    return 'test-' + (new Date()).getTime();
}

describe('Metronome client (integration)', () => {
    let jobPayload;

    afterEach(Promise.coroutine(function * () {
        yield sut.removeJob(jobPayload);
    }));

    context('Create a new job', () => {
        let result;

        beforeEach(Promise.coroutine(function * () {
            jobPayload = {
                id: getRandomJobName(),
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
                id: getRandomJobName(),
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

    context('Find existing jobs', () => {
        let result;
        let jobName = getRandomJobName();

        beforeEach(Promise.coroutine(function * () {
            jobPayload = {
                id: jobName,
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

            result = yield sut.listJobs();
        }));

        it('should contain '+ jobName + ' in list', () => {
            const createdJob = result.filter(job => job.id === jobName);

            expect(createdJob).to.have.length(1);
        });
    });

});
