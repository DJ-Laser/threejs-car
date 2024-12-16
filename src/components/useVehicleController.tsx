import {
  DynamicRayCastVehicleController,
  Vector,
} from "@dimforge/rapier3d-compat";
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from "@react-three/rapier";
import { RefObject, useCallback, useRef } from "react";
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

export interface VehicleController {
  controllerRef: RefObject<DynamicRayCastVehicleController>;
  chassisRef: (chassis: RapierRigidBody) => void;
  getWheelRef: (index: number) => (wheel: Object3D) => void;
}

export function useVehicleController(wheels: WheelInfo[]): VehicleController {
  const { world } = useRapier();
  const controllerRef = useRef<DynamicRayCastVehicleController | null>(null);
  const wheelsRef: RefObject<(Object3D | null)[]> = useRef([]);

  const chassisRef = useCallback(
    (chassis: RapierRigidBody | null) => {
      if (chassis == null) {
        // Cleanup code
        if (controllerRef.current) {
          world.removeVehicleController(controllerRef.current);
          controllerRef.current = null;
        }
        return;
      }
      const controller = world.createVehicleController(chassis);

      wheels.forEach((wheel, i) => {
        controller.addWheel(
          wheel.position,
          wheel.suspension.travelDirection,
          wheel.axleAxis,
          wheel.suspension.restDistance,
          wheel.radius,
        );

        controller.setWheelSuspensionStiffness(i, wheel.suspension.stiffness);
        controller.setWheelMaxSuspensionTravel(
          i,
          wheel.suspension.travelDistance,
        );
      });

      controllerRef.current = controller;
    },
    [world, wheels],
  );

  useAfterPhysicsStep(() => {
    if (controllerRef.current) {
      const controller = controllerRef.current;
      controller?.updateVehicle(world.timestep);
      wheels.forEach((wheel, i) => {
        const wheelObject = wheelsRef.current![i];
        if (wheelObject == null) return;

        const connectionPoint = controller.wheelChassisConnectionPointCs(i);
        if (connectionPoint == null) return;
        wheelObject.position.copy(connectionPoint);

        // Add offset position to starting position to get real position
        const suspensionOffset = new Vector3();
        suspensionOffset.copy(wheel.suspension.travelDirection);

        // If we got the connection point, the wheel must be a valid index
        const suspensionTravel = controller.wheelSuspensionLength(i)!;
        suspensionOffset.setLength(suspensionTravel);

        wheelObject.position.add(suspensionOffset);
      });
    }
  });

  return {
    chassisRef,
    controllerRef,
    getWheelRef: (index) => (wheel) => (wheelsRef.current![index] = wheel),
  };
}
