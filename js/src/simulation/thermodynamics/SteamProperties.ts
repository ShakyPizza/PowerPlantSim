import { IAPWS97 } from 'neutriumjs.thermo.iapws97';

export class SteamProperties {
    private static instance: SteamProperties;
    private iapws97: IAPWS97;

    private constructor() {
        this.iapws97 = new IAPWS97();
    }

    public static getInstance(): SteamProperties {
        if (!SteamProperties.instance) {
            SteamProperties.instance = new SteamProperties();
        }
        return SteamProperties.instance;
    }

    /**
     * Calculate steam properties at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Steam properties object
     */
    public getPropertiesPT(pressure: number, temperature: number) {
        // Convert pressure from bar to MPa
        const pressureMPa = pressure / 10;
        // Convert temperature from °C to K
        const temperatureK = temperature + 273.15;

        return this.iapws97.setPT(pressureMPa, temperatureK);
    }

    /**
     * Calculate steam properties at given pressure and quality
     * @param pressure Pressure in bar (absolute)
     * @param quality Steam quality (0-1)
     * @returns Steam properties object
     */
    public getPropertiesPX(pressure: number, quality: number) {
        // Convert pressure from bar to MPa
        const pressureMPa = pressure / 10;

        return this.iapws97.setPX(pressureMPa, quality);
    }

    /**
     * Calculate saturated steam temperature at given pressure
     * @param pressure Pressure in bar (absolute)
     * @returns Temperature in °C
     */
    public getSaturatedTemperature(pressure: number): number {
        const pressureMPa = pressure / 10;
        const properties = this.iapws97.setPX(pressureMPa, 1.0);
        return properties.t - 273.15; // Convert K to °C
    }

    /**
     * Calculate saturated pressure at given temperature
     * @param temperature Temperature in °C
     * @returns Pressure in bar (absolute)
     */
    public getSaturatedPressure(temperature: number): number {
        const temperatureK = temperature + 273.15;
        const properties = this.iapws97.setTX(temperatureK, 1.0);
        return properties.p * 10; // Convert MPa to bar
    }

    /**
     * Calculate steam quality at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Steam quality (0-1)
     */
    public getSteamQuality(pressure: number, temperature: number): number {
        const pressureMPa = pressure / 10;
        const temperatureK = temperature + 273.15;
        const properties = this.iapws97.setPT(pressureMPa, temperatureK);
        return properties.x;
    }

    /**
     * Calculate specific enthalpy at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Specific enthalpy in kJ/kg
     */
    public getEnthalpy(pressure: number, temperature: number): number {
        const pressureMPa = pressure / 10;
        const temperatureK = temperature + 273.15;
        const properties = this.iapws97.setPT(pressureMPa, temperatureK);
        return properties.h;
    }

    /**
     * Calculate specific entropy at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Specific entropy in kJ/kg·K
     */
    public getEntropy(pressure: number, temperature: number): number {
        const pressureMPa = pressure / 10;
        const temperatureK = temperature + 273.15;
        const properties = this.iapws97.setPT(pressureMPa, temperatureK);
        return properties.s;
    }

    /**
     * Calculate specific volume at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Specific volume in m³/kg
     */
    public getSpecificVolume(pressure: number, temperature: number): number {
        const pressureMPa = pressure / 10;
        const temperatureK = temperature + 273.15;
        const properties = this.iapws97.setPT(pressureMPa, temperatureK);
        return properties.v;
    }

    /**
     * Calculate isentropic enthalpy drop across a turbine
     * @param inletPressure Inlet pressure in bar (absolute)
     * @param inletTemp Inlet temperature in °C
     * @param outletPressure Outlet pressure in bar (absolute)
     * @returns Isentropic enthalpy drop in kJ/kg
     */
    public calculateIsentropicEnthalpyDrop(
        inletPressure: number,
        inletTemp: number,
        outletPressure: number
    ): number {
        const inletEnthalpy = this.getEnthalpy(inletPressure, inletTemp);
        const inletEntropy = this.getEntropy(inletPressure, inletTemp);
        
        // Find outlet temperature that gives same entropy at outlet pressure
        let outletTemp = this.getSaturatedTemperature(outletPressure);
        let outletEntropy = this.getEntropy(outletPressure, outletTemp);
        
        // Binary search to find temperature that gives same entropy
        let lowTemp = this.getSaturatedTemperature(outletPressure);
        let highTemp = inletTemp;
        let tolerance = 0.0001;
        let maxIterations = 100;
        let iterations = 0;

        while (Math.abs(outletEntropy - inletEntropy) > tolerance && iterations < maxIterations) {
            if (outletEntropy < inletEntropy) {
                lowTemp = outletTemp;
                outletTemp = (outletTemp + highTemp) / 2;
            } else {
                highTemp = outletTemp;
                outletTemp = (outletTemp + lowTemp) / 2;
            }
            outletEntropy = this.getEntropy(outletPressure, outletTemp);
            iterations++;
        }

        const outletEnthalpy = this.getEnthalpy(outletPressure, outletTemp);
        return inletEnthalpy - outletEnthalpy;
    }
} 