interface Version {
  _id?: string;
  job: {
    jobId: string;
    jobName: string;
  }
  entity: {
    entityId: string,
    entityName: string
  },
  author?: string;
  version?: number;     
  notes?: string[];   
  type?: string;  
  thumbUrl?: string;
  description?: string;
  date: string;
  public: boolean;
}
