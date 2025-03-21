import { BaseComponent } from './BaseComponent';
import { TurbineResult } from '../types';
import { SteamProperties } from '../thermodynamics/SteamProperties';

export class SteamTurbine extends BaseComponent<TurbineResult> {
    private steamProps: SteamProperties;

    constructor() {
        super('SteamTurbine');
        this.steamProps = SteamProperties.getInstance();
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

        // Calculate isentropic enthalpy drop using steam tables
        const isentropicEnthalpyDrop = this.steamProps.calculateIsentropicEnthalpyDrop(
            turbine_inlet_pressure,
            turbine_inlet_temp,
            turbine_outlet_pressure
        );

        // Calculate actual enthalpy drop considering efficiency
        const actualEnthalpyDrop = isentropicEnthalpyDrop * this.getState('efficiency');

        // Calculate mechanical power output (MW)
        const mechanicalPower = (actualEnthalpyDrop * turbine_inlet_steam_flow * this.getState('mechanical_efficiency')) / 1000;

        // Calculate exhaust conditions using steam tables
        const exhaustPressure = turbine_outlet_pressure;
        const exhaustTemp = this.steamProps.getSaturatedTemperature(exhaustPressure);

        return {
            mechanical_power: mechanicalPower,
            steam_flow_out: turbine_inlet_steam_flow, // Assuming no steam loss
            exhaust_pressure: exhaustPressure,
            exhaust_temperature: exhaustTemp
        };
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