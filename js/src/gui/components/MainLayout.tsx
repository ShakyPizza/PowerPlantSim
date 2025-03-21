import React from 'react';
import { SimulationState } from '../../simulation/types';
import { ControlPanel } from './ControlPanel';
import { FlowDiagram } from './FlowDiagram';
import { PowerPlot } from './PowerPlot';

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
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4">
                <h1 className="text-2xl font-bold">Geothermal Power Plant Simulator</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left side - Flow Diagram and Power Plot */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <div className="flex-1 mb-4 overflow-hidden">
                        <FlowDiagram state={state} />
                    </div>
                    <div className="h-1/3 overflow-hidden">
                        <PowerPlot state={state} />
                    </div>
                </div>

                {/* Right side - Control Panel */}
                <div className="w-1/4 h-full border-l border-gray-700">
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
        </div>
    );
}; 