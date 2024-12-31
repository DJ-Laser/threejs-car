# Car Simulation

A **janky** but fun car simulation built with **Three.js**, **React Three Fiber**, and **Rapier** physics.
The simulation features movement based on wheel rotation and steering, as well as suspension, implemented using Rapier joints.
This project was built with **React** and uses **Vite** for development.

## Stuff I made

- 🚗 3D car simulation using Three.js and React Three Fiber.
- 🛠️ Realistic(ish) physics using Rapier.
- ⚡ A way too complex system to load models using react hooks

## Getting Started

### Setup NodeJS

Use the nix flake:

- With direnv: `direnv allow`
- With flakes: `nix develop`

Or (If you're not a based nix user) manually intall:

- [Node.js](https://nodejs.org/) (v21+)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:5173` in your browser to see the simulation in action.

## Technologies Used

- **React**: Because I'm too jsx brained to make ui with vanilla js.
- **Three.js**: A powerful library for creating 3D scenes in javascript.
- **React Three Fiber**: React integration with Three.js
- **Rapier**: A performant and physics engine written in rust ❤️
- **Vite**: Because hot reload is literally overpowered

## License

This project is licensed under the MIT License because my code is bad and I really dont care if anyone takes it.
