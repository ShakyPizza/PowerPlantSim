import { BaseComponent } from './BaseComponent';
import { SeparatorResult } from '../types';
import { SteamProperties } from '../thermodynamics/SteamProperties';

export class SteamSeparator extends BaseComponent<SeparatorResult> {
    private steamProps: SteamProperties;

    constructor() {
        super('SteamSeparator');
        this.steamProps = SteamProperties.getInstance();
        // Initialize with default values
        this.setState('efficiency', 0.98);  // 98% separation efficiency
    }

    process(inputs: Record<string, number>): SeparatorResult {
        const {
            separator_inlet_pressure,
            separator_inlet_temp,
            separator_inlet_flow
        } = inputs;

        // Calculate steam quality using steam tables
        const steamQuality = this.steamProps.getSteamQuality(
            separator_inlet_pressure,
            separator_inlet_temp
        );

        // Calculate separated steam flow
        const steamFlow = separator_inlet_flow * steamQuality * this.getState('efficiency');
        const wasteWaterFlow = separator_inlet_flow - steamFlow;

        // Calculate outlet conditions using steam tables
        const outletPressure = separator_inlet_pressure * 0.95; // 5% pressure drop
        const outletTemp = this.steamProps.getSaturatedTemperature(outletPressure);

        return {
            separator_outlet_pressure: outletPressure,
            separator_outlet_steam_flow: steamFlow,
            separator_outlet_steam_temp: outletTemp,
            waste_water_flow: wasteWaterFlow
        };
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }
} 