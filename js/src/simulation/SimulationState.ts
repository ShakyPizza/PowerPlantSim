/**
 * Represents the complete state of the power plant simulation.
 * Contains all measurable parameters and calculated values.
 */
export interface SimulationState {
    /** Wellhead pressure in barG (gauge pressure) */
    wellhead_pressure: number;
    /** Wellhead temperature in °C */
    wellhead_temp: number;
    /** Wellhead mass flow rate in kg/s */
    wellhead_flow: number;
    /** Pressure at steam separator outlet in barG */
    separator_outlet_pressure: number | null;
    /** Steam flow rate at separator outlet in kg/s */
    separator_outlet_steam_flow: number | null;
    /** Steam temperature at separator outlet in °C */
    separator_outlet_steam_temp: number | null;
    /** Waste water flow rate in kg/s */
    waste_water_flow: number | null;
    /** Mechanical power output from turbine in MW */
    turbine_out_power: number;
    /** Electrical power output from generator in MW */
    electrical_power: number;
    /** Total steam flow rate in kg/s */
    steam_flow: number | null;
    /** Condenser pressure in bar (absolute) */
    condenser_pressure: number;
    /** Condenser temperature in °C */
    condenser_temp: number;
} 