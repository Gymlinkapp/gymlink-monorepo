export type Chat = {
  uid: string;

  messages: Message[];
  users: string[];
};

export type Message = {
  content: string;
  createdAt: string;
  sender: string;
};
