import { CommandEnum } from '../../enums/command.enum';
import { MessageInterface } from '../message.interface';

export type HighlightCommandInterface = MessageInterface & {
  command: CommandEnum.HIGHLIGHT;
};
