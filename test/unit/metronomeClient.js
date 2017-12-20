const expect = require('./../chai').expect;
const Promise = require('bluebird');
const sinonAsPromised = require('sinon-as-promised')(Promise);

const MetronomeClient = require('../../MetronomeClient.js');

describe('Metronome client', () => {
  let sut;
  let httpClient;
  let metronomeBaseUrl;

  beforeEach(() => {
    metronomeBaseUrl = 'http://metronome.mesos:9000';

    httpClient = sinonAsPromised.stub();

    httpClient.resolves({
      body: {
        id: 'somekind-id',
        jobId: 'someJobId',
      },
    });

    sut = new MetronomeClient({
      metronomeBaseUrl,
      httpClient,
    });
  });

  context('Create a new job', () => {
    let result;
    const createJobPayload = {
      id: 'hello-sleep-600-3',
      run: {
        cpus: 0.01,
        mem: 32,
        disk: 0,
        docker: {
          image: 'busybox',
        },
      },
    };

    beforeEach(Promise.coroutine(function* beforeEachHandler() {
      result = yield sut.createJob(createJobPayload);
    }));

    it('should contain job id', () => expect(result).to.have.property('id'));

    it('should call http client exactly with', () => {
      expect(httpClient).to.be.calledWithExactly({
        method: 'POST',
        json: true,
        url: `${metronomeBaseUrl}/v1/jobs`,
        body: createJobPayload,
      });
    });
  });

  context('Run an existing job', () => {
    let result;
    let inputPayload;

    beforeEach(Promise.coroutine(function* beforeEachHandler() {
      inputPayload = {
        id: 'hello-sleep-600-3',
      };
      result = yield sut.runJob(inputPayload);
    }));

    it('should contain id', () => expect(result).to.have.property('id'));
    it('should contain job id', () => expect(result).to.have.property('jobId'));

    it('should call http client exactly with', () => {
      expect(httpClient).to.be.calledWithExactly({
        method: 'POST',
        json: true,
        url: `${metronomeBaseUrl}/v1/jobs/${inputPayload.id}/runs`,
      });
    });
  });

  context('Remove an existing job', () => {
    let inputPayload;

    beforeEach(Promise.coroutine(function* beforeEachHandler() {
      inputPayload = {
        id: 'hello-sleep-600-3',
      };
      yield sut.removeJob(inputPayload);
    }));

    it('should call http client exactly with', () => {
      expect(httpClient).to.be.calledWithExactly({
        method: 'DELETE',
        json: true,
        url: `${metronomeBaseUrl}/v1/jobs/${inputPayload.id}?stopCurrentJobRuns=true`,
      });
    });
  });

  context('Find jobs', () => {
    beforeEach(Promise.coroutine(function* beforeEachHandler() {
      yield sut.listJobs();
    }));

    it('should call http client exactly with', () => {
      expect(httpClient).to.be.calledWithExactly({
        method: 'GET',
        json: true,
        url: `${metronomeBaseUrl}/v1/jobs`,
      });
    });
  });

  context('Find jobs with argument "history"', () => {
    const argument = 'history';

    beforeEach(Promise.coroutine(function* beforeEachHandler() {
      yield sut.listJobs(argument);
    }));

    it('should call http client exactly with', () => {
      expect(httpClient).to.be.calledWithExactly({
        method: 'GET',
        json: true,
        url: `${metronomeBaseUrl}/v1/jobs?embed=${argument}`,
      });
    });
  });
});
