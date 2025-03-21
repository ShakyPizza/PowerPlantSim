import { BaseComponent } from './BaseComponent';
import { CondenserResult } from '../types';
import { SteamProperties } from '../thermodynamics/SteamProperties';

export class Condenser extends BaseComponent<CondenserResult> {
    private steamProps: SteamProperties;

    constructor() {
        super('Condenser');
        this.steamProps = SteamProperties.getInstance();
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

        // Calculate condensation heat transfer using steam tables
        const inletEnthalpy = this.steamProps.getEnthalpy(inlet_pressure, inlet_temp);
        const outletPressure = inlet_pressure * (1 - this.getState('pressure_drop'));
        const outletTemp = this.steamProps.getSaturatedTemperature(outletPressure);
        const outletEnthalpy = this.steamProps.getEnthalpy(outletPressure, outletTemp);

        // Calculate heat transfer (enthalpy difference)
        const heatTransfer = inlet_flow * (inletEnthalpy - outletEnthalpy);

        // Calculate actual heat transfer considering efficiency
        const actualHeatTransfer = heatTransfer * this.getState('efficiency');

        return {
            pressure: outletPressure,
            temperature: outletTemp,
            cooling_capacity: actualHeatTransfer / 1000 // Convert to MW
        };
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