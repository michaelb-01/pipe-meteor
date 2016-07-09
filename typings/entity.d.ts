interface Entity {
  _id?: string;
  name?: string;
  type?: string;       // asset/build
  status?: string;     // not started, active, pending review, complete
  agency?: string;
  thumbUrl?: string;
}