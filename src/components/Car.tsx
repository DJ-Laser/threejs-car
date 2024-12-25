import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  usePrismaticJoint,
  useRevoluteJoint,
  useSpringJoint,
} from "@react-three/rapier";
import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Object3D, Vector3 } from "three";
import { CAR_GROUP, STATIC_GROUP, WHEEL_GROUP } from "../collisionGroups";
import { usePoliceCar } from "./models/usePoliceCar";
import { movementKeymap, useControls } from "./useControls";

interface WheelProps {
  chassisRef: RefObject<RapierRigidBody>;
  object: Object3D;
}

interface WheelRef {
  setSteeringAngle(angle: number): void;
  setWheelSpeed(speed: number): void;
  setSteerEnabled(steerEnabled: boolean): void;
}

const Wheel = forwardRef<WheelRef, WheelProps>(function Wheel(
  { object, chassisRef },
  ref,
) {
  const wheelRef = useRef<RapierRigidBody>(null);
  const axleRef = useRef<RapierRigidBody>(null);
  const suspensionRef = useRef<RapierRigidBody>(null);
  const sideOffsetDir = useMemo(
    () => (object.position.x < 0 ? -1 : 1),
    [object],
  );
  const initialPos = useMemo<[number, number, number]>(() => {
    const { x, y, z } = object.position;
    const xOffset = sideOffsetDir * 0.1;

    return [x + xOffset, y, z];
  }, [sideOffsetDir, object]);

  const initialWorldPos = useMemo(() => {
    if (!chassisRef.current) return initialPos;
    const pos = new Vector3();
    pos.copy(chassisRef.current.translation());
    pos.x += initialPos[0];
    pos.y += initialPos[1];
    pos.z += initialPos[2];
    return pos;
  }, [chassisRef, initialPos]);

  useSpringJoint(chassisRef, suspensionRef, [
    initialPos,
    [0, 0, 0],
    0.1,
    300,
    4,
  ]);
  usePrismaticJoint(chassisRef, suspensionRef, [
    initialPos,
    [0, 0, 0],
    [0, -1, 0],
    [0.05, 1],
  ]);

  const steeringJointRef = useRevoluteJoint(suspensionRef, axleRef, [
    [0, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
  ]);

  const rotationJointRef = useRevoluteJoint(axleRef, wheelRef, [
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
  ]);

  const setSteerEnabled = useCallback(
    (steerEnabled: boolean) => {
      if (!steeringJointRef.current) return;
      const steeringJoint = steeringJointRef.current;
      const steeringLimits = 0.5;

      if (steerEnabled) {
        steeringJoint.setLimits(-steeringLimits, steeringLimits);
      } else {
        steeringJoint.setLimits(0, 0);
      }
    },
    [steeringJointRef],
  );

  useEffect(() => setSteerEnabled(false), [setSteerEnabled]);

  useImperativeHandle(ref, () => {
    return {
      setSteeringAngle(angle) {
        if (!steeringJointRef.current) return;
        const steeringJoint = steeringJointRef.current;
        steeringJoint.configureMotorPosition(angle, 2000, 100);
      },

      setWheelSpeed(speed) {
        if (!rotationJointRef.current) return;
        const axleJoint = rotationJointRef.current;
        axleJoint.configureMotorVelocity(speed, 2);
      },

      setSteerEnabled,
    };
  }, [rotationJointRef, setSteerEnabled, steeringJointRef]);

  const wheelWidth = 0.3;
  const wheelRadius = 0.28;

  return (
    <>
      <RigidBody
        ref={suspensionRef}
        collisionGroups={interactionGroups([])}
        position={initialWorldPos}
        density={1}
      >
        <CuboidCollider args={[0.25, 0.25, 0.25]} />
      </RigidBody>
      <RigidBody
        ref={axleRef}
        collisionGroups={interactionGroups([])}
        position={[0, 0, 0]}
      >
        <CuboidCollider args={[0.25, 0.25, 0.25]} />
      </RigidBody>
      <RigidBody
        ref={wheelRef}
        collisionGroups={interactionGroups(WHEEL_GROUP, STATIC_GROUP)}
        colliders={false}
        position={initialWorldPos}
      >
        <CylinderCollider
          args={[wheelWidth / 2, wheelRadius]}
          position={[(wheelWidth / 2) * sideOffsetDir, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          friction={1.45}
        />
        <primitive object={object} position={[0, 0, 0]} />
      </RigidBody>
    </>
  );
});

export function Car() {
  const { chassis, wheels } = usePoliceCar();
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelRefs = useRef<(WheelRef | null)[]>([]);

  const controls = useControls(movementKeymap);

  useFrame(() => {
    if (!chassisRef.current) return;
    let enginePower = controls.get("forward") ? 1 : 0;
    enginePower += controls.get("backward") ? -1 : 0;
    enginePower *= 700;

    // In radians
    let turnAngle = controls.get("left") ? 1 : 0;
    turnAngle += controls.get("right") ? -1 : 0;

    wheelRefs.current.forEach((wheel, i) => {
      if (!wheel) return;
      if (i < 2) {
        wheel.setSteeringAngle(turnAngle / 2);
        wheel.setSteerEnabled(true);
      } else {
        wheel.setSteeringAngle(0);
        wheel.setWheelSpeed(enginePower);
      }
    });
  });

  return (
    <>
      <RigidBody
        ref={chassisRef}
        colliders="trimesh"
        collisionGroups={interactionGroups(CAR_GROUP)}
        canSleep={false}
        position={[0, 1.5, 0]}
      >
        <primitive object={chassis} />
      </RigidBody>
      {wheels.map((wheel, i) => (
        <Wheel
          key={i}
          object={wheel}
          chassisRef={chassisRef}
          ref={(ref) => (wheelRefs.current[i] = ref)}
        />
      ))}
    </>
  );
}
