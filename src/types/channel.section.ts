import { IMenu } from './menu';
import { IBranch } from './branch';

export interface IChannelSection {
  id: string;
  branch: IBranch;
  active: boolean;
  // section: ISection;
  menu: IMenu;
  // tables: IChannelTable[];
}
