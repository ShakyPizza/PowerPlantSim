import React, { useState, useEffect } from 'react';
import { MainLayout } from './components/MainLayout';
import { SimulationEngine } from '../simulation/SimulationEngine';
import { SimulationState } from '../simulation/types';

export const App: React.FC = () => {
    const [engine] = useState(() => new SimulationEngine());
    const [state, setState] = useState<SimulationState>(engine.getState());
    const [isRunning, setIsRunning] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(10);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = 0;

        const updateSimulation = (currentTime: number) => {
            if (!isRunning) return;

            const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            if (deltaTime >= 1 / simulationSpeed) { // Update at specified speed
                engine.stepSimulation();
                setState(engine.getState());
                lastTime = currentTime;
            }

            animationFrameId = requestAnimationFrame(updateSimulation);
        };

        if (isRunning) {
            animationFrameId = requestAnimationFrame(updateSimulation);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isRunning, simulationSpeed, engine]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        engine.reset();
        setState(engine.getState());
    };

    const handleSpeedChange = (speed: number) => {
        setSimulationSpeed(speed);
    };

    const handleWellheadPressureChange = (pressure: number) => {
        engine.setWellheadPressure(pressure);
        setState(engine.getState());
    };

    const handleWellheadTemperatureChange = (temperature: number) => {
        engine.setWellheadTemperature(temperature);
        setState(engine.getState());
    };

    const handleWellheadFlowChange = (flow: number) => {
        engine.setWellheadFlow(flow);
        setState(engine.getState());
    };

    const handleTurbineLoadChange = (load: number) => {
        // Convert percentage to actual power output
        const maxPower = 45.0; // Maximum power output in MW
        engine.setState('turbine_out_power', (load / 100.0) * maxPower);
        setState(engine.getState());
    };

    const handleCoolingTowerFanSpeedChange = (speed: number) => {
        // Adjust condenser temperature based on fan speed
        const baseTemp = 35.0; // Base condenser temperature
        const tempRange = 10.0; // Temperature range affected by fan speed
        engine.setState('condenser_temp', baseTemp + (100 - speed) / 100.0 * tempRange);
        setState(engine.getState());
    };

    return (
        <MainLayout
            state={state}
            isRunning={isRunning}
            onStartStop={handleStartStop}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            onWellheadPressureChange={handleWellheadPressureChange}
            onWellheadTemperatureChange={handleWellheadTemperatureChange}
            onWellheadFlowChange={handleWellheadFlowChange}
            onTurbineLoadChange={handleTurbineLoadChange}
            onCoolingTowerFanSpeedChange={handleCoolingTowerFanSpeedChange}
        />
    );
}; 