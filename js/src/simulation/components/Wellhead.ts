import { BaseComponent } from './BaseComponent';

export interface WellheadOutput extends Record<string, number> {
    pressure: number;    // barG
    temperature: number; // °C
    flow: number;       // kg/s
}

export class Wellhead extends BaseComponent<WellheadOutput> {
    constructor() {
        super('Wellhead');
        // Initialize with default values
        this.setState('pressure', 10.5);    // barG
        this.setState('temperature', 178);  // °C
        this.setState('flow', 85);          // kg/s
    }

    process(inputs?: Record<string, number>): WellheadOutput {
        // If no inputs provided, use internal state
        const pressure = inputs?.pressure ?? this.getState('pressure');
        const temperature = inputs?.temperature ?? this.getState('temperature');
        const flow = inputs?.flow ?? this.getState('flow');

        return {
            pressure,
            temperature,
            flow
        };
    }

    // Methods to update wellhead conditions
    setPressure(pressure: number): void {
        this.setState('pressure', pressure);
    }

    setTemperature(temperature: number): void {
        this.setState('temperature', temperature);
    }

    setFlow(flow: number): void {
        this.setState('flow', flow);
    }
} 