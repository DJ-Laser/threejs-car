import { RawDynamicRayCastVehicleController } from "@dimforge/rapier3d-compat/rapier_wasm3d";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import { useCallback, useRef } from "react";
import { Vector3 } from "three";

export interface WheelInfo {
  position: Vector3;
  axleAxis: Vector3;
}

export interface VehicleController {
  controller: RawDynamicRayCastVehicleController;
  chassisRef: (chassis: RapierRigidBody) => void;
  wheelPositions: Vector3[];
}

export function useVehicleController(wheels: WheelInfo[]): VehicleController {
  const { world } = useRapier();
  const controllerRef = useRef(null);

  const chassisRef = useCallback(
    (chassis: RapierRigidBody) => {
      const controller = world.createVehicleController(chassis);
      controller.addWheel();
    },
    [world],
  );
}
