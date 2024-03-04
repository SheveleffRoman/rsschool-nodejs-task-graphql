import { memberHandlers } from './memberHandlers.js';
import { postHandlers } from './postHandlers.js';
import { profileHandlers } from './profileHandlers.js';
import { userHandlers } from './userHandlers.js';

export function getAllRestHandlers() {
  return {
    ...memberHandlers,
    ...postHandlers,
    ...profileHandlers,
    ...userHandlers,
  };
}
