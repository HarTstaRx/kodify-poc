import { CommandEnum } from '../../enums/command.enum';
import { MessageInterface } from '../message.interface';

export type ThinkCommandInterface = MessageInterface & {
  command: CommandEnum.THINK;
};
