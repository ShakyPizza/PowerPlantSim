export interface SimulationState {
    wellhead_pressure: number;      // barG
    wellhead_temp: number;         // °C
    wellhead_flow: number;         // kg/s
    separator_outlet_pressure: number | null;
    separator_outlet_steam_flow: number | null;
    separator_outlet_steam_temp: number | null;
    waste_water_flow: number | null;
    turbine_out_power: number;     // MW
    electrical_power: number;      // MW
    steam_flow: number | null;     // kg/s
    condenser_pressure: number;    // bar
    condenser_temp: number;        // °C
}

export interface Component<T extends Record<string, number> = Record<string, number>> {
    process(inputs: Record<string, number>): T;
}

export interface WellheadOutput {
    pressure: number;    // barG
    temperature: number; // °C
    flow: number;       // kg/s
}

export interface SeparatorResult {
    separator_outlet_pressure: number;
    separator_outlet_steam_flow: number;
    separator_outlet_steam_temp: number;
    waste_water_flow: number;
}

export interface TurbineResult {
    mechanical_power: number;  // MW
    steam_flow_out: number;    // kg/s
    exhaust_pressure: number;  // bar
    exhaust_temperature: number; // °C
}

export interface CondenserResult {
    pressure: number;      // bar
    temperature: number;   // °C
    cooling_capacity: number; // MW
} 