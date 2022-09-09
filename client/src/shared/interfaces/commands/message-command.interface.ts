import { CommandEnum } from '../../enums/command.enum';
import { MessageInterface } from '../message.interface';

export type MessageCommandInterface = MessageInterface & {
  command: CommandEnum.MESSAGE;
};
