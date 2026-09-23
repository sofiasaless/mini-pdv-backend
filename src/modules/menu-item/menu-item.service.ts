import { BaseService } from '../../common/base/base.service';
import { Collections } from '../../common/enum/collections.enum';
import { MenuItem } from './menu-item.entity';

export class MenuItemService extends BaseService<MenuItem> {
  constructor() {
    super(Collections.MENU_ITEM);
  }
}

export const menuItemService = new MenuItemService();