import { BaseComponent } from './BaseComponent';

interface GeneratorResult {
    electrical_power: number;  // MW
    efficiency: number;        // %
    voltage: number;          // kV
    frequency: number;        // Hz
}

export class Generator extends BaseComponent<GeneratorResult> {
    constructor() {
        super('Generator');
        // Initialize with default values
        this.setState('efficiency', 0.98);     // 98% electrical efficiency
        this.setState('voltage', 11);          // 11 kV
        this.setState('frequency', 50);        // 50 Hz
        this.setState('power_factor', 0.95);   // 0.95 power factor
    }

    process(inputs: Record<string, number>): GeneratorResult {
        const {
            mechanical_power
        } = inputs;

        // Calculate electrical power output considering efficiency and power factor
        const electricalPower = mechanical_power * 
            this.getState('efficiency') * 
            this.getState('power_factor');

        return {
            electrical_power: electricalPower,
            efficiency: this.getState('efficiency') * 100,
            voltage: this.getState('voltage'),
            frequency: this.getState('frequency')
        };
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setVoltage(voltage: number): void {
        this.setState('voltage', voltage);
    }

    setFrequency(frequency: number): void {
        this.setState('frequency', frequency);
    }

    setPowerFactor(powerFactor: number): void {
        this.setState('power_factor', Math.min(1, Math.max(0, powerFactor)));
    }
} 