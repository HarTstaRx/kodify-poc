import {
  MessageInterface,
  TypingInterface,
  NickInterface,
  DeleteLastInterface,
  FadeLastInterface,
} from '../shared/interfaces';
import { BaseService } from './base.service';

class ChatService extends BaseService {
  #endpoint = 'http://localhost:2023/';

  sendMessage = (message: MessageInterface): Promise<void> =>
    this.postData(`${this.#endpoint}chat`, message);
  startTyping = (command: TypingInterface): Promise<void> =>
    this.postData(`${this.#endpoint}start-typing`, command);
  stopTyping = (command: TypingInterface): Promise<void> =>
    this.postData(`${this.#endpoint}stop-typing`, command);
  changeNick = (command: NickInterface): Promise<void> =>
    this.postData(`${this.#endpoint}nick`, command);
  deleteLast = (command: DeleteLastInterface): Promise<void> =>
    this.postData(`${this.#endpoint}delete-last`, command);
  fadeLast = (command: FadeLastInterface): Promise<void> =>
    this.postData(`${this.#endpoint}fadelast`, command);
}

export const chatService = new ChatService();
