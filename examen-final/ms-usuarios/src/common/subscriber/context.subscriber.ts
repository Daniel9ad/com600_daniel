import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { UserGlobal } from 'src/auth/user.global';

@EventSubscriber()
export class ContextSubscriber implements EntitySubscriberInterface {
  /**
   * Called before post insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    if (event.entity) {
      event.entity.creationUser = UserGlobal.id;
      event.entity.updateUser = UserGlobal.id;
    }
  }

  /**
   * Called before entity update.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    if (event.entity) {
      event.entity.updateUser = UserGlobal.id;
    }
  }

  /**
   * Called before entity removal.
   */
  beforeRemove(event: RemoveEvent<any>) {
    if (event.entity) {
      event.entity.updateUser = UserGlobal.id;
    }
  }
}
