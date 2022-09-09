import { CountdownCommandInterface } from './countdown-command.interface';
import { DeleteCommandInterface } from './delete-command.interface';
import { FadeCommandInterface } from './fade-command.interface';
import { HighlightCommandInterface } from './highlight-command.interface';
import { MessageCommandInterface } from './message-command.interface';
import { NickCommandInterface } from './nick-command.interface';
import { ThinkCommandInterface } from './think-command.interface';
import { TypingCommandInterface } from './typing-command.interface';

export type CommandInterface =
  | MessageCommandInterface
  | HighlightCommandInterface
  | ThinkCommandInterface
  | DeleteCommandInterface
  | FadeCommandInterface
  | CountdownCommandInterface
  | NickCommandInterface
  | TypingCommandInterface;
