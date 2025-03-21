import { SimulationState } from './SimulationState';
import { Wellhead } from './components/Wellhead';
import { SteamSeparator } from './components/SteamSeparator';
import { MoistureSeparator } from './components/MoistureSeparator';
import { SteamTurbine } from './components/SteamTurbine';
import { Condenser } from './components/Condenser';
import { Generator } from './components/Generator';
import { CoolingTower } from './components/CoolingTower';

/**
 * Main simulation engine that coordinates all power plant components.
 * Manages the flow of steam and calculations through the entire system.
 */
export class SimulationEngine {
    private wellhead: Wellhead;
    private steamSeparator: SteamSeparator;
    private moistureSeparator: MoistureSeparator;
    private turbine: SteamTurbine;
    private condenser: Condenser;
    private generator: Generator;
    private coolingTower: CoolingTower;
    private state: SimulationState;

    /**
     * Create a new simulation engine with all components initialized.
     * Sets up initial conditions for the simulation.
     */
    constructor() {
        this.wellhead = new Wellhead();
        this.steamSeparator = new SteamSeparator();
        this.moistureSeparator = new MoistureSeparator();
        this.turbine = new SteamTurbine();
        this.condenser = new Condenser();
        this.generator = new Generator();
        this.coolingTower = new CoolingTower();
        
        // Initialize simulation state
        this.state = {
            wellhead_pressure: 10.5,   // barG
            wellhead_temp: 178,        // °C
            wellhead_flow: 85,         // kg/s
            separator_outlet_pressure: null,
            separator_outlet_steam_flow: null,
            separator_outlet_steam_temp: null,
            waste_water_flow: null,
            turbine_out_power: 0.0,
            electrical_power: 0.0,
            steam_flow: null,
            condenser_pressure: 0.06,
            condenser_temp: 35,
        };
    }

    /**
     * Advance the simulation by one step.
     * Processes all components in sequence and updates the simulation state.
     * @returns The updated simulation state
     */
    stepSimulation(): SimulationState {
        // 1. Get wellhead conditions
        const wellheadOutput = this.wellhead.process();
        this.state.wellhead_pressure = wellheadOutput.pressure;
        this.state.wellhead_temp = wellheadOutput.temperature;
        this.state.wellhead_flow = wellheadOutput.flow;

        // 2. Process steam separator
        const separatorResult = this.steamSeparator.process({
            separator_inlet_pressure: this.state.wellhead_pressure,
            separator_inlet_temp: this.state.wellhead_temp,
            separator_inlet_flow: this.state.wellhead_flow
        });

        // 3. Process moisture separator
        const moistureResult = this.moistureSeparator.process({
            separator_inlet_pressure: separatorResult.separator_outlet_pressure,
            separator_inlet_temp: separatorResult.separator_outlet_steam_temp,
            separator_inlet_flow: separatorResult.separator_outlet_steam_flow
        });

        // 4. Process turbine
        const turbineResult = this.turbine.process({
            turbine_inlet_pressure: moistureResult.separator_outlet_pressure,
            turbine_inlet_temp: moistureResult.separator_outlet_steam_temp,
            turbine_inlet_steam_flow: moistureResult.separator_outlet_steam_flow,
            turbine_outlet_pressure: this.state.condenser_pressure
        });

        // 5. Process condenser
        const condenserResult = this.condenser.process({
            inlet_flow: turbineResult.steam_flow_out,
            inlet_temp: turbineResult.exhaust_temperature,
            inlet_pressure: turbineResult.exhaust_pressure
        });

        // 6. Process cooling tower
        const coolingResult = this.coolingTower.process({
            inlet_temp: condenserResult.temperature,
            water_flow: 1000 // Default cooling water flow
        });

        // 7. Process generator
        const generatorResult = this.generator.process({
            mechanical_power: turbineResult.mechanical_power
        });

        // Update state with all results
        this.state.separator_outlet_pressure = moistureResult.separator_outlet_pressure;
        this.state.separator_outlet_steam_flow = moistureResult.separator_outlet_steam_flow;
        this.state.separator_outlet_steam_temp = moistureResult.separator_outlet_steam_temp;
        this.state.waste_water_flow = moistureResult.waste_water_flow;
        this.state.steam_flow = moistureResult.separator_outlet_steam_flow;
        this.state.turbine_out_power = turbineResult.mechanical_power;
        this.state.electrical_power = generatorResult.electrical_power;
        this.state.condenser_pressure = condenserResult.pressure;
        this.state.condenser_temp = coolingResult.outlet_temp;

        return this.state;
    }

    /**
     * Get the current simulation state.
     * @returns A copy of the current simulation state
     */
    getState(): SimulationState {
        return { ...this.state };
    }

    /**
     * Reset the simulation to initial conditions.
     */
    reset(): void {
        // Reset to initial conditions
        this.state = {
            wellhead_pressure: 10.5,   // barG
            wellhead_temp: 178,        // °C
            wellhead_flow: 85,         // kg/s
            separator_outlet_pressure: null,
            separator_outlet_steam_flow: null,
            separator_outlet_steam_temp: null,
            waste_water_flow: null,
            turbine_out_power: 0.0,
            electrical_power: 0.0,
            steam_flow: null,
            condenser_pressure: 0.06,
            condenser_temp: 35,
        };
    }

    /**
     * Set a specific state value.
     * @param key - The state parameter to update
     * @param value - The new value to set
     */
    setState(key: keyof SimulationState, value: number): void {
        this.state[key] = value;
    }

    /**
     * Set the wellhead pressure.
     * @param pressure - Pressure in barG
     */
    setWellheadPressure(pressure: number): void {
        this.wellhead.setPressure(pressure);
    }

    /**
     * Set the wellhead temperature.
     * @param temperature - Temperature in °C
     */
    setWellheadTemperature(temperature: number): void {
        this.wellhead.setTemperature(temperature);
    }

    /**
     * Set the wellhead flow rate.
     * @param flow - Flow rate in kg/s
     */
    setWellheadFlow(flow: number): void {
        this.wellhead.setFlow(flow);
    }

    /**
     * Set the steam separator efficiency.
     * @param efficiency - Efficiency value between 0 and 1
     */
    setSeparatorEfficiency(efficiency: number): void {
        this.steamSeparator.setEfficiency(efficiency);
    }

    /**
     * Set the moisture separator efficiency.
     * @param efficiency - Efficiency value between 0 and 1
     */
    setMoistureSeparatorEfficiency(efficiency: number): void {
        this.moistureSeparator.setEfficiency(efficiency);
    }

    /**
     * Set the turbine efficiency.
     * @param efficiency - Efficiency value between 0 and 1
     */
    setTurbineEfficiency(efficiency: number): void {
        this.turbine.setEfficiency(efficiency);
    }

    /**
     * Set the condenser efficiency.
     * @param efficiency - Efficiency value between 0 and 1
     */
    setCondenserEfficiency(efficiency: number): void {
        this.condenser.setEfficiency(efficiency);
    }

    /**
     * Set the generator efficiency.
     * @param efficiency - Efficiency value between 0 and 1
     */
    setGeneratorEfficiency(efficiency: number): void {
        this.generator.setEfficiency(efficiency);
    }

    /**
     * Set the cooling tower efficiency.
     * @param efficiency - Efficiency value between 0 and 1
     */
    setCoolingTowerEfficiency(efficiency: number): void {
        this.coolingTower.setEfficiency(efficiency);
    }
} 