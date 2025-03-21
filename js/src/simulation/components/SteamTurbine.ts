import { BaseComponent } from './BaseComponent';
import { TurbineResult } from '../types';

export class SteamTurbine extends BaseComponent<TurbineResult> {
    constructor() {
        super('SteamTurbine');
        // Initialize with default values
        this.setState('efficiency', 0.85);     // 85% isentropic efficiency
        this.setState('mechanical_efficiency', 0.98); // 98% mechanical efficiency
        this.setState('pressure_drop', 0.95);  // 95% pressure drop across turbine
    }

    process(inputs: Record<string, number>): TurbineResult {
        const {
            turbine_inlet_pressure,
            turbine_inlet_temp,
            turbine_inlet_steam_flow,
            turbine_outlet_pressure
        } = inputs;

        // Calculate isentropic enthalpy drop (simplified)
        const enthalpyDrop = this.calculateEnthalpyDrop(
            turbine_inlet_pressure,
            turbine_inlet_temp,
            turbine_outlet_pressure
        );

        // Calculate actual enthalpy drop considering efficiency
        const actualEnthalpyDrop = enthalpyDrop * this.getState('efficiency');

        // Calculate mechanical power output (MW)
        const mechanicalPower = (actualEnthalpyDrop * turbine_inlet_steam_flow * this.getState('mechanical_efficiency')) / 1000;

        // Calculate exhaust conditions
        const exhaustPressure = turbine_outlet_pressure;
        const exhaustTemp = this.calculateSaturatedSteamTemp(exhaustPressure);

        return {
            mechanical_power: mechanicalPower,
            steam_flow_out: turbine_inlet_steam_flow, // Assuming no steam loss
            exhaust_pressure: exhaustPressure,
            exhaust_temperature: exhaustTemp
        };
    }

    private calculateEnthalpyDrop(inletPressure: number, inletTemp: number, outletPressure: number): number {
        // Simplified enthalpy drop calculation
        // In reality, this would use steam tables and thermodynamic properties
        const inletEnthalpy = this.calculateSteamEnthalpy(inletPressure, inletTemp);
        const outletEnthalpy = this.calculateSteamEnthalpy(outletPressure, this.calculateSaturatedSteamTemp(outletPressure));
        return inletEnthalpy - outletEnthalpy;
    }

    private calculateSteamEnthalpy(pressure: number, temperature: number): number {
        // Simplified steam enthalpy calculation
        // In reality, this would use steam tables
        return temperature * 2.1 + pressure * 100; // Rough approximation
    }

    private calculateSaturatedSteamTemp(pressure: number): number {
        // Simplified saturated steam temperature calculation
        // In reality, this would use steam tables
        return 100 + (pressure - 1) * 20; // Rough approximation
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setMechanicalEfficiency(efficiency: number): void {
        this.setState('mechanical_efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setPressureDrop(pressureDrop: number): void {
        this.setState('pressure_drop', Math.min(1, Math.max(0, pressureDrop)));
    }
} 