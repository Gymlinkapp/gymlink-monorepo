export type User = {
  id: string;
  email: string;
  name: string;
  authStep: string;
  image: string;
  uid: string;
  gym: {
    place_id: string;
    description: string;
  };
};
