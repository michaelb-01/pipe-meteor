interface Job {
  _id?: string;
  name?: string;
  client?: string;
  agency?: string;
  thumbUrl?: string;
  entities?: [{
    type?: string;
  }];
  public: boolean;
}