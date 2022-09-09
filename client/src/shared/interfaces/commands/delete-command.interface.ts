import { CommandEnum } from '../../enums/command.enum';
import { DeleteLastInterface } from '../delete-last.interface';

export type DeleteCommandInterface = DeleteLastInterface & {
  command: CommandEnum.DELETE_LAST;
};
