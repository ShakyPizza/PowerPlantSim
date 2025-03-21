import { BaseComponent } from './BaseComponent';

interface CoolingTowerResult extends Record<string, number> {
    outlet_temp: number;      // °C
    water_loss: number;       // kg/s
    cooling_capacity: number; // MW
    approach_temp: number;    // °C
}

export class CoolingTower extends BaseComponent<CoolingTowerResult> {
    constructor() {
        super('CoolingTower');
        // Initialize with default values
        this.setState('efficiency', 0.85);     // 85% cooling efficiency
        this.setState('wet_bulb_temp', 20);    // °C
        this.setState('approach_temp', 5);      // °C
        this.setState('drift_loss', 0.002);    // 0.2% drift loss
        this.setState('evaporation_loss', 0.01); // 1% evaporation loss
    }

    process(inputs: Record<string, number>): CoolingTowerResult {
        const {
            inlet_temp,
            water_flow
        } = inputs;

        // Calculate cooling capacity
        const coolingCapacity = this.calculateCoolingCapacity(
            water_flow,
            inlet_temp,
            this.getState('wet_bulb_temp')
        );

        // Calculate actual cooling considering efficiency
        const actualCooling = coolingCapacity * this.getState('efficiency');

        // Calculate outlet temperature
        const outletTemp = this.calculateOutletTemp(
            inlet_temp,
            actualCooling,
            water_flow
        );

        // Calculate water losses
        const driftLoss = water_flow * this.getState('drift_loss');
        const evaporationLoss = water_flow * this.getState('evaporation_loss');
        const totalWaterLoss = driftLoss + evaporationLoss;

        // Calculate approach temperature
        const approachTemp = outletTemp - this.getState('wet_bulb_temp');

        return {
            outlet_temp: outletTemp,
            water_loss: totalWaterLoss,
            cooling_capacity: actualCooling / 1000, // Convert to MW
            approach_temp: approachTemp
        };
    }

    private calculateCoolingCapacity(flow: number, inletTemp: number, wetBulbTemp: number): number {
        // Simplified cooling capacity calculation
        // In reality, this would use detailed heat and mass transfer calculations
        const specificHeat = 4.2; // kJ/kg·K (water)
        const tempDiff = inletTemp - wetBulbTemp;
        return flow * specificHeat * tempDiff;
    }

    private calculateOutletTemp(inletTemp: number, cooling: number, flow: number): number {
        // Simplified outlet temperature calculation
        const specificHeat = 4.2; // kJ/kg·K (water)
        const tempDrop = cooling / (flow * specificHeat);
        return inletTemp - tempDrop;
    }

    setEfficiency(efficiency: number): void {
        this.setState('efficiency', Math.min(1, Math.max(0, efficiency)));
    }

    setWetBulbTemp(temperature: number): void {
        this.setState('wet_bulb_temp', temperature);
    }

    setApproachTemp(temperature: number): void {
        this.setState('approach_temp', temperature);
    }

    setDriftLoss(loss: number): void {
        this.setState('drift_loss', Math.min(0.01, Math.max(0, loss)));
    }

    setEvaporationLoss(loss: number): void {
        this.setState('evaporation_loss', Math.min(0.05, Math.max(0, loss)));
    }
} 