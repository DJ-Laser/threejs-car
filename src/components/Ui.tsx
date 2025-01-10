export function Ui() {
  return (
    <div
      className="w-fit p-2 pr-4 rounded-br-2xl flex flex-col justify-center bg-neutral-900/50 font-mono"
      style={{ textShadow: "1px 1px 1px black" }}
    >
      <h3 className="text-xl">Controls:</h3>
      <p>wasd: drive</p>
      <p>r: flip car</p>
    </div>
  );
}
