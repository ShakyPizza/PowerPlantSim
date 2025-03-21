import React from 'react';
import { SimulationState } from '../../simulation/types';
import { ControlPanel } from './ControlPanel';

interface MainLayoutProps {
    state: SimulationState;
    isRunning: boolean;
    onStartStop: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    onWellheadPressureChange: (pressure: number) => void;
    onWellheadTemperatureChange: (temperature: number) => void;
    onWellheadFlowChange: (flow: number) => void;
    onTurbineLoadChange: (load: number) => void;
    onCoolingTowerFanSpeedChange: (speed: number) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    state,
    isRunning,
    onStartStop,
    onReset,
    onSpeedChange,
    onWellheadPressureChange,
    onWellheadTemperatureChange,
    onWellheadFlowChange,
    onTurbineLoadChange,
    onCoolingTowerFanSpeedChange
}) => {
    return (
        <div className="flex h-screen bg-gray-900">
            {/* Left panel - Flow Diagram (60%) */}
            <div className="w-3/5 h-full bg-gray-800">
                {/* Flow diagram will go here */}
                <div className="w-full h-full flex items-center justify-center text-white">
                    Flow Diagram Coming Soon
                </div>
            </div>

            {/* Right panel - Controls (40%) */}
            <div className="w-2/5 h-full">
                <ControlPanel
                    state={state}
                    isRunning={isRunning}
                    onStartStop={onStartStop}
                    onReset={onReset}
                    onSpeedChange={onSpeedChange}
                    onWellheadPressureChange={onWellheadPressureChange}
                    onWellheadTemperatureChange={onWellheadTemperatureChange}
                    onWellheadFlowChange={onWellheadFlowChange}
                    onTurbineLoadChange={onTurbineLoadChange}
                    onCoolingTowerFanSpeedChange={onCoolingTowerFanSpeedChange}
                />
            </div>
        </div>
    );
}; 