export type User = {
  id: string;
  email: string;
  name: string;
  authStep: string;
  image: string;
  uid: string;
  age: number;
  gym: {
    place_id: string;
    description: string;
  };
};
