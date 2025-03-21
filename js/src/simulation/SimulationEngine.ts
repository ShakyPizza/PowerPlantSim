import { SimulationState } from './types';
import { Wellhead } from './components/Wellhead';
import { SteamSeparator } from './components/SteamSeparator';
import { MoistureSeparator } from './components/MoistureSeparator';
import { SteamTurbine } from './components/SteamTurbine';
import { Condenser } from './components/Condenser';
import { Generator } from './components/Generator';
import { CoolingTower } from './components/CoolingTower';

export class SimulationEngine {
    private wellhead: Wellhead;
    private steamSeparator: SteamSeparator;
    private moistureSeparator: MoistureSeparator;
    private turbine: SteamTurbine;
    private condenser: Condenser;
    private generator: Generator;
    private coolingTower: CoolingTower;
    private state: SimulationState;

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

    getState(): SimulationState {
        return { ...this.state };
    }

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

    setState(key: keyof SimulationState, value: number): void {
        this.state[key] = value;
    }

    // Methods to update component parameters
    setWellheadPressure(pressure: number): void {
        this.wellhead.setPressure(pressure);
    }

    setWellheadTemperature(temperature: number): void {
        this.wellhead.setTemperature(temperature);
    }

    setWellheadFlow(flow: number): void {
        this.wellhead.setFlow(flow);
    }

    setSeparatorEfficiency(efficiency: number): void {
        this.steamSeparator.setEfficiency(efficiency);
    }

    setMoistureSeparatorEfficiency(efficiency: number): void {
        this.moistureSeparator.setEfficiency(efficiency);
    }

    setTurbineEfficiency(efficiency: number): void {
        this.turbine.setEfficiency(efficiency);
    }

    setCondenserEfficiency(efficiency: number): void {
        this.condenser.setEfficiency(efficiency);
    }

    setGeneratorEfficiency(efficiency: number): void {
        this.generator.setEfficiency(efficiency);
    }

    setCoolingTowerEfficiency(efficiency: number): void {
        this.coolingTower.setEfficiency(efficiency);
    }
} 