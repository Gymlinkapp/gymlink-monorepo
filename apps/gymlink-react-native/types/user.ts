export type Gym = {
  place_id: string;
  description: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  authStep: string;
  image: string;
  uid: string;
  age: number;
  chats: [];
  gym?: Gym; // make gym optional
  gyms?: Gym[]; // array of gyms
  gymPlans?: {
    movements: [];
    isGoingToday: boolean;
    date: string;
  }[];
  blockedUsers: string[];
};
