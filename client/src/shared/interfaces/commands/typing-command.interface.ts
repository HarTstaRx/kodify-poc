import { CommandEnum } from '../../enums/command.enum';
import { TypingInterface } from '../typing.interface';

export type TypingCommandInterface = TypingInterface & {
  command: CommandEnum.START_TYPING | CommandEnum.STOP_TYPING;
};
