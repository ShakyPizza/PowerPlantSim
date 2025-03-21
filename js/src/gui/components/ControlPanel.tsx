import React, { useState } from 'react';
import { SimulationState } from '../../simulation/SimulationState';

interface ControlPanelProps {
    onStartStop: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    onWellheadPressureChange: (pressure: number) => void;
    onWellheadTemperatureChange: (temperature: number) => void;
    onWellheadFlowChange: (flow: number) => void;
    onTurbineLoadChange: (load: number) => void;
    onCoolingTowerFanSpeedChange: (speed: number) => void;
    state: SimulationState;
    isRunning: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    onStartStop,
    onReset,
    onSpeedChange,
    onWellheadPressureChange,
    onWellheadTemperatureChange,
    onWellheadFlowChange,
    onTurbineLoadChange,
    onCoolingTowerFanSpeedChange,
    state,
    isRunning
}) => {
    const [simulationSpeed, setSimulationSpeed] = useState(10);
    const [fanSpeed, setFanSpeed] = useState(70); // Default fan speed at 70%
    const [turbineLoad, setTurbineLoad] = useState(80); // Default turbine load at 80%

    const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const speed = parseInt(event.target.value);
        setSimulationSpeed(speed);
        onSpeedChange(speed);
    };

    const handleFanSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const speed = parseFloat(event.target.value);
        setFanSpeed(speed);
        onCoolingTowerFanSpeedChange(speed);
    };

    const handleTurbineLoadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const load = parseFloat(event.target.value);
        setTurbineLoad(load);
        onTurbineLoadChange(load);
    };

    return (
        <div className="w-full h-full bg-gray-800 text-white p-4 overflow-y-auto">
            {/* Simulation Controls */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Simulation Controls</h2>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onStartStop}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                        {isRunning ? 'Stop' : 'Start'}
                    </button>
                    <button
                        onClick={onReset}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                    >
                        Reset
                    </button>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={simulationSpeed}
                            onChange={handleSpeedChange}
                            className="w-32"
                        />
                        <span>Speed: {simulationSpeed}x</span>
                    </div>
                </div>
            </div>

            {/* Plant Controls */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Plant Controls</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Wellhead Pressure (barG)</label>
                        <input
                            type="range"
                            min="5"
                            max="20"
                            step="0.1"
                            value={state.wellhead_pressure}
                            onChange={(e) => onWellheadPressureChange(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <span className="ml-2">{state.wellhead_pressure.toFixed(1)}</span>
                    </div>
                    <div>
                        <label className="block mb-2">Wellhead Temperature (°C)</label>
                        <input
                            type="range"
                            min="150"
                            max="200"
                            step="0.1"
                            value={state.wellhead_temp}
                            onChange={(e) => onWellheadTemperatureChange(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <span className="ml-2">{state.wellhead_temp.toFixed(1)}</span>
                    </div>
                    <div>
                        <label className="block mb-2">Wellhead Flow (kg/s)</label>
                        <input
                            type="range"
                            min="50"
                            max="150"
                            step="0.1"
                            value={state.wellhead_flow}
                            onChange={(e) => onWellheadFlowChange(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <span className="ml-2">{state.wellhead_flow.toFixed(1)}</span>
                    </div>
                    <div>
                        <label className="block mb-2">Turbine Load (%)</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={turbineLoad}
                            onChange={handleTurbineLoadChange}
                            className="w-full"
                        />
                        <span className="ml-2">{turbineLoad.toFixed(1)}</span>
                    </div>
                    <div>
                        <label className="block mb-2">Cooling Tower Fan Speed (%)</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="0.1"
                            value={fanSpeed}
                            onChange={handleFanSpeedChange}
                            className="w-full"
                        />
                        <span className="ml-2">{fanSpeed.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Digital Displays */}
            <div>
                <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Wellhead Pressure</div>
                        <div className="text-2xl font-mono">{state.wellhead_pressure.toFixed(1)} barG</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Wellhead Temperature</div>
                        <div className="text-2xl font-mono">{state.wellhead_temp.toFixed(1)} °C</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Wellhead Flow</div>
                        <div className="text-2xl font-mono">{state.wellhead_flow.toFixed(1)} kg/s</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Separator Pressure</div>
                        <div className="text-2xl font-mono">
                            {state.separator_outlet_pressure?.toFixed(1) ?? '--'} barG
                        </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Steam Flow</div>
                        <div className="text-2xl font-mono">
                            {state.separator_outlet_steam_flow?.toFixed(1) ?? '--'} kg/s
                        </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Turbine Power</div>
                        <div className="text-2xl font-mono">{state.turbine_out_power.toFixed(1)} MW</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Condenser Pressure</div>
                        <div className="text-2xl font-mono">{state.condenser_pressure.toFixed(3)} barA</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <div className="text-sm text-gray-400">Condenser Temperature</div>
                        <div className="text-2xl font-mono">{state.condenser_temp.toFixed(1)} °C</div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 