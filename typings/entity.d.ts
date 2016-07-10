interface Entity {
  _id?: string;
  job: {
    jobId: string;
    jobName: string;
  }
  name?: string;
  type?: string;       // asset/build
  status?: string;     // not started, active, pending review, complete
  thumbUrl?: string;
  public: boolean;
}