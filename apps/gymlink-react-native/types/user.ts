export type User = {
  id: string;
  email: string;
  name: string;
  authStep: string;
  gym: {
    place_id: string;
    description: string;
  };
};
