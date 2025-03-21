# Geothermal Power Plant Simulator

A modern web-based simulator for geothermal power plants, built with React, TypeScript, and Vite.

## Features

- Real-time simulation of geothermal power plant components
- Interactive control panel for adjusting plant parameters
- Live monitoring of key metrics
- Dark mode interface
- Accurate thermodynamic calculations using steam tables

## Components

The simulator includes the following main components:

- **Wellhead**: Controls the geothermal fluid inlet conditions
- **Separator**: Removes moisture from the steam
- **Turbine**: Converts thermal energy to mechanical energy
- **Generator**: Converts mechanical energy to electrical power
- **Condenser**: Condenses steam back to water
- **Cooling Tower**: Cools the condenser water

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd js
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Development

### Project Structure

```
js/
├── src/
│   ├── gui/           # React components and UI logic
│   ├── simulation/    # Core simulation engine and components
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── index.html         # Entry point
```

### Key Technologies

- React 18
- TypeScript
- Vite
- TailwindCSS
- Custom thermodynamic calculations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
