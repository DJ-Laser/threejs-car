import { useFrame } from "@react-three/fiber";
import {
  CylinderCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  usePrismaticJoint,
  useRevoluteJoint,
  useSpringJoint,
} from "@react-three/rapier";
import { RefObject, useMemo, useRef } from "react";
import { Object3D, Vector3 } from "three";
import { usePoliceCar } from "./models/usePoliceCar";
import { movementKeymap, useControls } from "./useControls";

interface WheelProps {
  chassis: RefObject<RapierRigidBody>;
  object: Object3D;
}

function Wheel({ object, chassis }: WheelProps) {
  const wheelRef = useRef<RapierRigidBody>(null);
  const axleRef = useRef<RapierRigidBody>(null);
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
    if (!chassis.current) return initialPos;
    const pos = new Vector3();
    pos.copy(chassis.current.translation());
    pos.x += initialPos[0];
    pos.y += initialPos[1];
    pos.z += initialPos[2];
    return pos;
  }, [chassis, initialPos]);

  useSpringJoint(chassis, axleRef, [initialPos, [0, 0, 0], 0.2, 50, 4]);
  usePrismaticJoint(chassis, axleRef, [
    initialPos,
    [0, 0, 0],
    [0, -1, 0],
    [0.05, 1],
  ]);
  useRevoluteJoint(axleRef, wheelRef, [
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
  ]);

  const wheelWidth = 0.3;
  const wheelRadius = 0.28;

  return (
    <>
      <RigidBody
        ref={axleRef}
        collisionGroups={interactionGroups([])}
        position={initialWorldPos}
      >
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      <RigidBody
        ref={wheelRef}
        friction={1.45}
        restitution={0}
        colliders={false}
        position={initialWorldPos}
      >
        <CylinderCollider
          args={[wheelWidth / 2, wheelRadius]}
          position={[(wheelWidth / 2) * sideOffsetDir, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
        <primitive object={object} position={[0, 0, 0]} />
      </RigidBody>
    </>
  );
}

export function Car() {
  const { chassis, wheels } = usePoliceCar();
  const chassisRef = useRef<RapierRigidBody>(null);

  const controls = useControls(movementKeymap);

  useFrame(() => {
    if (!chassisRef.current) return;
    const chassis = chassisRef.current;

    let enginePower = controls.get("forward") ? 1 : 0;
    enginePower += controls.get("backward") ? -1 : 0;
    enginePower *= 70;

    chassis.resetForces(false);
    chassis.addForce(
      new Vector3(0, 0, enginePower).applyQuaternion(chassis.rotation()),
      true,
    );

    // In radians
    let turnAngle = controls.get("left") ? 1 : 0;
    turnAngle += controls.get("right") ? -1 : 0;
    turnAngle *= 30;

    chassis.resetTorques(false);
    chassis.addTorque(
      new Vector3(0, turnAngle, 0).applyQuaternion(chassis.rotation()),
      true,
    );
  });

  return (
    <>
      <RigidBody
        position={[0, 1.5, 0]}
        ref={chassisRef}
        colliders="trimesh"
        canSleep={false}
      >
        <primitive object={chassis} />
      </RigidBody>
      {wheels.map((wheel, i) => (
        <Wheel key={i} object={wheel} chassis={chassisRef} />
      ))}
    </>
  );
}
