import { Object3D } from "three";

export interface Car {
  chassis: Object3D;
  wheels: Object3D[];
}
