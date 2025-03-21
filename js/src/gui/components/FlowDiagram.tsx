import React from 'react';
import { SimulationState } from '../../simulation/types';

interface FlowDiagramProps {
    state: SimulationState;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ state }) => {
    // SVG dimensions
    const width = 800;
    const height = 600;
    const padding = 40;

    // Component positions
    const wellheadPos = { x: padding, y: height / 2 };
    const separatorPos = { x: padding + 150, y: height / 2 };
    const moistureSeparatorPos = { x: padding + 300, y: height / 2 };
    const turbinePos = { x: padding + 450, y: height / 2 };
    const condenserPos = { x: padding + 600, y: height / 2 };

    // Colors based on state
    const getSteamColor = (temp: number) => {
        const hue = Math.min(240 - (temp - 100) * 2, 240); // Blue to red
        return `hsl(${hue}, 100%, 50%)`;
    };

    return (
        <svg width={width} height={height} className="w-full h-full">
            {/* Background */}
            <rect width={width} height={height} fill="#1a1a1a" />

            {/* Steam lines */}
            <path
                d={`M ${wellheadPos.x + 40} ${wellheadPos.y} 
                    L ${separatorPos.x} ${separatorPos.y}`}
                stroke={getSteamColor(state.wellhead_temp)}
                strokeWidth="4"
                fill="none"
            />
            <path
                d={`M ${separatorPos.x + 40} ${separatorPos.y} 
                    L ${moistureSeparatorPos.x} ${moistureSeparatorPos.y}`}
                stroke={getSteamColor(state.separator_outlet_steam_temp ?? 0)}
                strokeWidth="4"
                fill="none"
            />
            <path
                d={`M ${moistureSeparatorPos.x + 40} ${moistureSeparatorPos.y} 
                    L ${turbinePos.x} ${turbinePos.y}`}
                stroke={getSteamColor(state.separator_outlet_steam_temp ?? 0)}
                strokeWidth="4"
                fill="none"
            />
            <path
                d={`M ${turbinePos.x + 40} ${turbinePos.y} 
                    L ${condenserPos.x} ${condenserPos.y}`}
                stroke={getSteamColor(state.condenser_temp)}
                strokeWidth="4"
                fill="none"
            />

            {/* Components */}
            {/* Wellhead */}
            <g transform={`translate(${wellheadPos.x}, ${wellheadPos.y})`}>
                <rect x="-30" y="-30" width="60" height="60" fill="#4a4a4a" />
                <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12">WH</text>
            </g>

            {/* Steam Separator */}
            <g transform={`translate(${separatorPos.x}, ${separatorPos.y})`}>
                <rect x="-30" y="-30" width="60" height="60" fill="#4a4a4a" />
                <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12">SS</text>
            </g>

            {/* Moisture Separator */}
            <g transform={`translate(${moistureSeparatorPos.x}, ${moistureSeparatorPos.y})`}>
                <rect x="-30" y="-30" width="60" height="60" fill="#4a4a4a" />
                <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12">MS</text>
            </g>

            {/* Turbine */}
            <g transform={`translate(${turbinePos.x}, ${turbinePos.y})`}>
                <rect x="-30" y="-30" width="60" height="60" fill="#4a4a4a" />
                <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12">T</text>
            </g>

            {/* Condenser */}
            <g transform={`translate(${condenserPos.x}, ${condenserPos.y})`}>
                <rect x="-30" y="-30" width="60" height="60" fill="#4a4a4a" />
                <text x="0" y="0" textAnchor="middle" fill="white" fontSize="12">C</text>
            </g>

            {/* Labels */}
            <text x={wellheadPos.x} y={wellheadPos.y - 50} textAnchor="middle" fill="white" fontSize="12">
                {state.wellhead_pressure.toFixed(1)} barG
            </text>
            <text x={separatorPos.x} y={separatorPos.y - 50} textAnchor="middle" fill="white" fontSize="12">
                {state.separator_outlet_pressure?.toFixed(1) ?? '--'} barG
            </text>
            <text x={turbinePos.x} y={turbinePos.y - 50} textAnchor="middle" fill="white" fontSize="12">
                {state.turbine_out_power.toFixed(1)} MW
            </text>
            <text x={condenserPos.x} y={condenserPos.y - 50} textAnchor="middle" fill="white" fontSize="12">
                {state.condenser_pressure.toFixed(3)} barA
            </text>
        </svg>
    );
}; 