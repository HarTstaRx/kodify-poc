import { MessageInterface, TypingInterface } from '../shared/interfaces';
import { BaseService } from './base.service';

class ChatService extends BaseService {
  #endpoint = 'http://localhost:2023/';

  sendMessage = (message: MessageInterface): Promise<void> =>
    this.postData(`${this.#endpoint}chat`, message);
  startTyping = (command: TypingInterface): Promise<void> =>
    this.postData(`${this.#endpoint}start-typing`, command);
  stopTyping = (command: TypingInterface): Promise<void> =>
    this.postData(`${this.#endpoint}stop-typing`, command);
}

export const chatService = new ChatService();
