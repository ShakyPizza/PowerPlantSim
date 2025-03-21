import { BaseComponent } from './BaseComponent';
import { WellheadOutput } from '../types';

export class Wellhead extends BaseComponent {
    constructor() {
        super('Wellhead');
        // Initialize with default values
        this.setState('pressure', 10.5);    // barG
        this.setState('temperature', 178);  // °C
        this.setState('flow', 85);          // kg/s
    }

    process(): WellheadOutput {
        // In a real implementation, this would calculate values based on inputs
        // For now, we'll return the current state
        return {
            pressure: this.getState('pressure'),
            temperature: this.getState('temperature'),
            flow: this.getState('flow')
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