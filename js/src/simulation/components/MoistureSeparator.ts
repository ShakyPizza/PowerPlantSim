import { BaseComponent } from './BaseComponent';
import { SeparatorResult } from '../types';
import { SteamProperties } from '../thermodynamics/SteamProperties';

export class MoistureSeparator extends BaseComponent<SeparatorResult> {
    private steamProps: SteamProperties;

    constructor() {
        super('MoistureSeparator');
        this.steamProps = SteamProperties.getInstance();
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

        // Calculate moisture content using steam tables
        const steamQuality = this.steamProps.getSteamQuality(
            separator_inlet_pressure,
            separator_inlet_temp
        );
        const moistureContent = 1 - steamQuality;
        
        // Calculate moisture removal
        const moistureRemoval = moistureContent * this.getState('efficiency');
        const drySteamFlow = separator_inlet_flow * (1 - moistureRemoval);
        
        // Calculate pressure drop
        const outletPressure = separator_inlet_pressure * (1 - this.getState('pressure_drop'));
        
        // Calculate outlet temperature using steam tables
        const outletTemp = this.steamProps.getSaturatedTemperature(outletPressure);

        return {
            separator_outlet_pressure: outletPressure,
            separator_outlet_steam_flow: drySteamFlow,
            separator_outlet_steam_temp: outletTemp,
            waste_water_flow: separator_inlet_flow - drySteamFlow
        };
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setPressureDrop(pressureDrop: number): void {
        this.setState('pressure_drop', Math.min(0.1, Math.max(0, pressureDrop)));
    }
} 