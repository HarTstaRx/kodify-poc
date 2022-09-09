import {
  MessageInterface,
  TypingInterface,
  NickInterface,
  DeleteLastInterface,
  FadeLastInterface,
  CountdownInterface,
} from '../shared/interfaces';
import { BaseService } from './base.service';

class ChatService extends BaseService {
  #endpoint = 'http://localhost:2023/';

  sendMessage = (message: MessageInterface): Promise<void> =>
    this.postData(`${this.#endpoint}message`, message);
  startTyping = (command: TypingInterface): Promise<void> =>
    this.postData(`${this.#endpoint}start-typing`, command);
  stopTyping = (command: TypingInterface): Promise<void> =>
    this.postData(`${this.#endpoint}stop-typing`, command);
  changeNick = (command: NickInterface): Promise<void> =>
    this.postData(`${this.#endpoint}nick`, command);
  deleteLast = (command: DeleteLastInterface): Promise<void> =>
    this.postData(`${this.#endpoint}delete-last`, command);
  fadeLast = (command: FadeLastInterface): Promise<void> =>
    this.postData(`${this.#endpoint}fade-last`, command);
  countdown = (command: CountdownInterface): Promise<void> =>
    this.postData(`${this.#endpoint}countdown`, command);
}

export const chatService = new ChatService();
