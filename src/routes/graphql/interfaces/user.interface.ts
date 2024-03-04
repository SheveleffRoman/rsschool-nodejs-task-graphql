import { Subscription } from './app.interface.js';

export interface User {
  id: string;
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
}
