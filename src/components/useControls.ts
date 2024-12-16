import { Map as ImmutableMap } from "immutable";
import { useEffect, useRef } from "react";

export type Keymap<Action> = ImmutableMap<string, Action>;
export type MovementAction = "forward" | "backward" | "left" | "right";

export const movementKeymap: Keymap<MovementAction> = ImmutableMap([
  ["ArrowUp", "forward"],
  ["ArrowDown", "backward"],
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"],
  ["KeyW", "forward"],
  ["KeyS", "backward"],
  ["KeyA", "left"],
  ["KeyD", "right"],
] as const);

export function useControls<Action>(keymap: Keymap<Action>): {
  get: (keycode: Action) => boolean;
} {
  const controlState = useRef(new Map());

  useEffect(() => {
    if (!controlState) return;
    const state = controlState.current;

    const handleKeydown = ({ code }: KeyboardEvent) => {
      if (!keymap.has(code)) return;
      // Set action based on keymap
      state.set(keymap.get(code), true);
      console.log(state);
    };

    const handleKeyup = ({ code }: KeyboardEvent) => {
      if (!keymap.has(code)) return;
      // Set action based on keymap
      state.set(keymap.get(code), false);
    };

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [keymap]);

  return (
    controlState.current ?? {
      get: () => false,
    }
  );
}
