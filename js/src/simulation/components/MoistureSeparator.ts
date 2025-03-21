import { BaseComponent } from './BaseComponent';
import { SeparatorResult } from '../types';

export class MoistureSeparator extends BaseComponent<SeparatorResult> {
    constructor() {
        super('MoistureSeparator');
        // Initialize with default values
        this.setState('efficiency', 0.99);  // 99% moisture removal efficiency
        this.setState('pressure_drop', 0.02); // 2% pressure drop
    }

    process(inputs: Record<string, number>): SeparatorResult {
        const {
            separator_inlet_pressure,
            separator_inlet_temp,
            separator_inlet_flow
        } = inputs;

        // Calculate moisture content (simplified)
        const moistureContent = this.calculateMoistureContent(separator_inlet_pressure, separator_inlet_temp);
        
        // Calculate moisture removal
        const moistureRemoval = moistureContent * this.getState('efficiency');
        const drySteamFlow = separator_inlet_flow * (1 - moistureRemoval);
        
        // Calculate pressure drop
        const outletPressure = separator_inlet_pressure * (1 - this.getState('pressure_drop'));
        
        // Calculate outlet temperature (simplified)
        const outletTemp = this.calculateSaturatedSteamTemp(outletPressure);

        return {
            separator_outlet_pressure: outletPressure,
            separator_outlet_steam_flow: drySteamFlow,
            separator_outlet_steam_temp: outletTemp,
            waste_water_flow: separator_inlet_flow - drySteamFlow
        };
    }

    private calculateMoistureContent(pressure: number, temperature: number): number {
        // Simplified moisture content calculation
        // In reality, this would use steam tables and thermodynamic properties
        const saturationTemp = this.calculateSaturatedSteamTemp(pressure);
        const superheat = temperature - saturationTemp;
        return Math.max(0, 0.1 - superheat / 100); // 10% moisture at saturation, decreasing with superheat
    }

    private calculateSaturatedSteamTemp(pressure: number): number {
        // Simplified saturated steam temperature calculation
        // In reality, this would use steam tables
        return 100 + (pressure - 1) * 20; // Rough approximation
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setPressureDrop(pressureDrop: number): void {
        this.setState('pressure_drop', Math.min(0.1, Math.max(0, pressureDrop)));
    }
} 