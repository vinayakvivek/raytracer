import { IEntity } from "../models/entity.model";

export class Entity {
  id: number;
  name: string;

  constructor(props: IEntity) {
    this.id = props.id;
    this.name = props.name;
  }
}
