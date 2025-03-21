import { BaseComponent } from './BaseComponent';
import { CondenserResult } from '../types';

export class Condenser extends BaseComponent<CondenserResult> {
    constructor() {
        super('Condenser');
        // Initialize with default values
        this.setState('efficiency', 0.95);     // 95% condensation efficiency
        this.setState('cooling_water_temp', 25); // °C
        this.setState('cooling_water_flow', 1000); // kg/s
        this.setState('pressure_drop', 0.1);   // 10% pressure drop
    }

    process(inputs: Record<string, number>): CondenserResult {
        const {
            inlet_flow,
            inlet_temp,
            inlet_pressure
        } = inputs;

        // Calculate condensation heat transfer (simplified)
        const heatTransfer = this.calculateHeatTransfer(
            inlet_flow,
            inlet_temp,
            this.getState('cooling_water_temp')
        );

        // Calculate actual heat transfer considering efficiency
        const actualHeatTransfer = heatTransfer * this.getState('efficiency');

        // Calculate outlet pressure
        const outletPressure = inlet_pressure * (1 - this.getState('pressure_drop'));

        // Calculate outlet temperature (saturated water at outlet pressure)
        const outletTemp = this.calculateSaturatedWaterTemp(outletPressure);

        return {
            pressure: outletPressure,
            temperature: outletTemp,
            cooling_capacity: actualHeatTransfer / 1000 // Convert to MW
        };
    }

    private calculateHeatTransfer(steamFlow: number, steamTemp: number, coolingWaterTemp: number): number {
        // Simplified heat transfer calculation
        // In reality, this would use heat transfer coefficients and detailed thermodynamics
        const tempDiff = steamTemp - coolingWaterTemp;
        const specificHeat = 4.2; // kJ/kg·K (water)
        return steamFlow * specificHeat * tempDiff;
    }

    private calculateSaturatedWaterTemp(pressure: number): number {
        // Simplified saturated water temperature calculation
        // In reality, this would use steam tables
        return 100 + (pressure - 1) * 20; // Rough approximation
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setCoolingWaterTemp(temperature: number): void {
        this.setState('cooling_water_temp', temperature);
    }

    setCoolingWaterFlow(flow: number): void {
        this.setState('cooling_water_flow', flow);
    }

    setPressureDrop(pressureDrop: number): void {
        this.setState('pressure_drop', Math.min(0.2, Math.max(0, pressureDrop)));
    }
} 