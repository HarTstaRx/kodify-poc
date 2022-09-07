export interface MessageInterface {
  from: string;
  timestamp: Date;
  text?: string;
  isDeleted: boolean;
  isThinking: boolean;
  isFadeLast: boolean;
  isHighlighted: boolean;
  newNick?: string;
  countDown?: {
    seconds: number;
    url: string;
  };
}
