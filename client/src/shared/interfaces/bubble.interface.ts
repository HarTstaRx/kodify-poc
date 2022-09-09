import { CountdownInterface } from './countdown.interface';
import { DeleteLastInterface } from './delete-last.interface';
import { MessageInterface } from './message.interface';

export interface BubbleInterface extends MessageInterface {
  isMine: boolean;
  isFaded?: boolean;
  isThinking?: boolean;
  isHighlighted?: boolean;
  deleted?: DeleteLastInterface;
  countDown?: CountdownInterface;
}
