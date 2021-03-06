class MetronomeClient {
  constructor(dependencies) {
    this.metronomeBaseUrl = dependencies.metronomeBaseUrl;
    this.httpClient = dependencies.httpClient;
  }

  createJob(job) {
    return this
      .httpClient({
        method: 'POST',
        body: job,
        url: `${this.metronomeBaseUrl}/v1/jobs`,
        json: true,
      })
      .then(response => response.body);
  }

  updateJob(job) {
    return this
      .httpClient({
        method: 'PUT',
        body: job,
        url: `${this.metronomeBaseUrl}/v1/jobs/${job.id}`,
        json: true,
      })
      .then(response => response.body);
  }

  getJob({ id, embed }) {
    const baseUrl = `${this.metronomeBaseUrl}/v1/jobs/${id}`;
    const url = embed ? `${baseUrl}?embed=${embed}` : baseUrl;
    return this
      .httpClient({
        method: 'GET',
        url,
        json: true,
      })
      .then(response => response.body);
  }

  runJob(job) {
    return this
      .httpClient({
        method: 'POST',
        json: true,
        url: `${this.metronomeBaseUrl}/v1/jobs/${job.id}/runs`,
      })
      .then(response => response.body);
  }

  removeJob(job) {
    return this
      .httpClient({
        method: 'DELETE',
        json: true,
        url: `${this.metronomeBaseUrl}/v1/jobs/${job.id}?stopCurrentJobRuns=true`,
      })
      .then(response => response.body);
  }

  listJobs(params) {
    let url = `${this.metronomeBaseUrl}/v1/jobs`;
    if (params) {
      url = `${url}?embed=${params}`;
    }
    return this
      .httpClient({
        method: 'GET',
        json: true,
        url,
      })
      .then(response => response.body);
  }
}

module.exports = MetronomeClient;
