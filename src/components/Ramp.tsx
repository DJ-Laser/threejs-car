import {
  interactionGroups,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { Color } from "three";
import { STATIC_GROUP } from "../collisionGroups";
import "./models/TrapezoidGeometry";

export function Ramp(props: RigidBodyProps) {
  return (
    <RigidBody
      type="fixed"
      colliders="hull"
      {...props}
      collisionGroups={interactionGroups(STATIC_GROUP)}
    >
      <mesh castShadow receiveShadow>
        <trapezoidGeometry args={[28.5, 8.3, 3.6, 20]} />
        <meshStandardMaterial color={new Color(0.4, 0.4, 0.4)} />
      </mesh>
    </RigidBody>
  );
}
