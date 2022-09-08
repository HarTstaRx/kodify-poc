import { MessageInterface } from '../shared/interfaces';
import { BaseService } from './base.service';

class ChatService extends BaseService {
  #endpoint = 'http://localhost:2023/';

  sendMessage = (message: MessageInterface): Promise<void> =>
    this.postData(`${this.#endpoint}chat`, message);
}

export const chatService = new ChatService();
