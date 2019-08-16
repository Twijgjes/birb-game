export abstract class Updateable {
  constructor() {
    Updateables.getInstance().addUpdateable(this);
  }
  abstract update(delta: number): void
}

export class Updateables {
  private static instance: Updateables;
  private static updateables: Array<Updateable>;

  private constructor() {
    Updateables.updateables = new Array();
  }

  static getInstance() {
    if(!Updateables.instance) {
      Updateables.instance = new Updateables();
    }
    return Updateables.instance;
  }

  addUpdateable(updateable: Updateable) {
    Updateables.updateables.push(updateable);
  }

  update(delta: number) {
    for (let updateable of Updateables.updateables) {
      updateable.update(delta);
    }
  }
}