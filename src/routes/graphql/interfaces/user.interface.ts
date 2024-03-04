import { Subscription } from './app.interface.js';

interface User {
  id: string;
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
}

export type { User };
