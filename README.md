# WASM Rust Labs 
A hands-on experimental platform exploring the integration of Rust (WebAssembly) within a React (Vite) environment. This project demonstrates various use cases for Rust WASM across different pages, focusing on performance, logic sharing, and seamless interoperability.

## Key Features
Rust + React Integration: Leverages wasm-pack and Vite plugins for a streamlined build and load experience.

Multi-Page Demos: Dedicated routes/pages showcasing specific Rust-powered features (e.g., heavy computations, calculators).

TypeScript Support: Fully typed interfaces for safe and predictable communication between Rust and JavaScript.

Modern Tooling: Powered by Vite for Hot Module Replacement (HMR) and fast developer feedback loops.

## Tech Stack
Frontend: React, TypeScript, Vite

WASM Core: Rust, wasm-bindgen, wasm-pack

Routing: React Router (for page-based demonstrations)

## Project Structure

```
├── rust-libs/          # Rust source code and compiled WASM modules
│   └── src/            # Rust logic (e.g., calculator, algorithms)
├── src/
│   ├── pages/          # Individual pages for different WASM demos
│   ├── hooks/          # Custom hooks for managing WASM lifecycle
│   └── App.tsx         # Main entry and routing
└── vite.config.ts      # Vite configuration with WASM plugin support
```

## Getting Started
Prerequisites
Ensure you have the following installed:

Rust & Cargo
wasm-pack
Node.js (v18 or later recommended)

Step 1: Build the Rust WASM Module
Navigate to the rust-libs directory and compile the Rust code to WASM:

```Bash

cd rust-libs
wasm-pack build --target web
Step 2: Launch the React App
Return to the root directory, install dependencies, and start the development server:

```

## From the root directory
```bash
npm install
npm run dev
```


📄 License
This project is open-sourced under the MIT License.
