import { Vector } from "@dimforge/rapier3d-compat";
import { Object3D, Vector3 } from "three";

export interface SuspensionInfo {
  travelDirection: Vector;
  travelDistance: number;
  restDistance: number;
  stiffness: number;
}

export interface WheelInfo {
  suspension: SuspensionInfo;
  position: Vector3;
  axleAxis: Vector;
  radius: number;
}

export function wheelsFrom(
  wheels: Object3D[],
  otherInfo: Omit<WheelInfo, "position">,
): WheelInfo[] {
  return wheels.map((wheel) => ({
    position: wheel.position,
    ...otherInfo,
  }));
}
