import { CommandEnum } from '../../enums/command.enum';
import { CountdownInterface } from '../countdown.interface';

export type CountdownCommandInterface = CountdownInterface & {
  command: CommandEnum.COUNTDOWN;
};
