import { DeleteLastInterface } from './delete-last.interface';

export interface MessageInterface {
  id: string;
  from: string;
  timestamp: Date;
  text?: string;
  deleted?: DeleteLastInterface;
  isThinking: boolean;
  isFadeLast: boolean;
  isHighlighted: boolean;
  newNick?: string;
  countDown?: {
    seconds: number;
    url: string;
  };
}
