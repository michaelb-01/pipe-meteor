interface User {
  _id?: string;
  name: string;
  entities?: [{
    entityId: string;
    entityName: string;
  }];
  email?: string;       
  phone?: number;
  roles?: [string];
  photoUrl?: string;
  public: boolean;
}