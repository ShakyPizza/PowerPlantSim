import React, { useEffect, useRef } from 'react';
import { SimulationState } from '../../simulation/types';

interface PowerPlotProps {
    state: SimulationState;
}

interface DataPoint {
    timestamp: number;
    mechanicalPower: number;
    electricalPower: number;
}

export const PowerPlot: React.FC<PowerPlotProps> = ({ state }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dataRef = useRef<DataPoint[]>([]);
    const maxDataPoints = 100; // Show last 100 data points

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Add new data point
        const now = Date.now();
        dataRef.current.push({
            timestamp: now,
            mechanicalPower: state.turbine_out_power,
            electricalPower: state.electrical_power
        });

        // Keep only last maxDataPoints
        if (dataRef.current.length > maxDataPoints) {
            dataRef.current = dataRef.current.slice(-maxDataPoints);
        }

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const y = (canvas.height * i) / 10;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();

        // Draw data
        const maxPower = Math.max(
            ...dataRef.current.map(d => Math.max(d.mechanicalPower, d.electricalPower)),
            50 // Default max power
        );

        // Draw mechanical power line
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        dataRef.current.forEach((point, i) => {
            const x = (canvas.width * i) / (maxDataPoints - 1);
            const y = canvas.height - (point.mechanicalPower / maxPower) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw electrical power line
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        dataRef.current.forEach((point, i) => {
            const x = (canvas.width * i) / (maxDataPoints - 1);
            const y = canvas.height - (point.electricalPower / maxPower) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw legend
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('Mechanical Power (MW)', 10, 20);
        ctx.fillText('Electrical Power (MW)', 10, 40);
    }, [state]);

    return (
        <div className="w-full h-48 bg-gray-800 p-4 rounded">
            <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full h-full"
            />
        </div>
    );
}; 