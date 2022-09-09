import { CommandEnum } from '../../enums/command.enum';
import { FadeLastInterface } from '../fade-last.interface';

export type FadeCommandInterface = FadeLastInterface & {
  command: CommandEnum.FADE_LAST;
};
