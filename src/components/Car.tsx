import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import CarFile from "../assets/kenny-car/police.obj?url";

export function Car() {
  const car = useLoader(OBJLoader, CarFile);
  return <primitive object={car} />;
}
