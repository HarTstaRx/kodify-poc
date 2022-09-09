import { CommandEnum } from '../../enums/command.enum';
import { NickInterface } from '../nick.interface';

export type NickCommandInterface = NickInterface & {
  command: CommandEnum.NICK;
};
