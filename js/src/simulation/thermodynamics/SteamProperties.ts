import { IAPWS97 } from "./mock-iapws97";  // Using mock implementation for development

export class SteamProperties {
    private static instance: SteamProperties;
    private steam: IAPWS97;

    private constructor() {
        this.steam = new IAPWS97();
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
        return {
            h: this.steam.h_pt(pressure, temperature),
            s: this.steam.s_pt(pressure, temperature),
            v: this.steam.v_pt(pressure, temperature),
            x: this.steam.x_pt(pressure, temperature)
        };
    }

    /**
     * Calculate steam properties at given pressure and quality
     * @param pressure Pressure in bar (absolute)
     * @param quality Steam quality (0-1)
     * @returns Steam properties object
     */
    public getPropertiesPX(pressure: number, quality: number) {
        const temp = this.steam.t_sat_p(pressure);
        return {
            h: this.steam.h_pt(pressure, temp),
            s: this.steam.s_pt(pressure, temp),
            v: this.steam.v_pt(pressure, temp),
            x: quality
        };
    }

    /**
     * Calculate saturated steam temperature at given pressure
     * @param pressure Pressure in bar (absolute)
     * @returns Temperature in °C
     */
    public getSaturatedTemperature(pressure: number): number {
        return this.steam.t_sat_p(pressure);
    }

    /**
     * Calculate saturated pressure at given temperature
     * @param temperature Temperature in °C
     * @returns Pressure in bar (absolute)
     */
    public getSaturatedPressure(temperature: number): number {
        return this.steam.p_sat_t(temperature);
    }

    /**
     * Calculate steam quality at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Steam quality (0-1)
     */
    public getSteamQuality(pressure: number, temperature: number): number {
        return this.steam.x_pt(pressure, temperature);
    }

    /**
     * Calculate specific enthalpy at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Specific enthalpy in kJ/kg
     */
    public getEnthalpy(pressure: number, temperature: number): number {
        return this.steam.h_pt(pressure, temperature);
    }

    /**
     * Calculate specific entropy at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Specific entropy in kJ/kg·K
     */
    public getEntropy(pressure: number, temperature: number): number {
        return this.steam.s_pt(pressure, temperature);
    }

    /**
     * Calculate specific volume at given pressure and temperature
     * @param pressure Pressure in bar (absolute)
     * @param temperature Temperature in °C
     * @returns Specific volume in m³/kg
     */
    public getSpecificVolume(pressure: number, temperature: number): number {
        return this.steam.v_pt(pressure, temperature);
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
        // Get inlet entropy
        const inletEntropy = this.getEntropy(inletPressure, inletTemp);
        
        // Get outlet enthalpy at same entropy (isentropic)
        const outletEnthalpy = this.steam.h_ps(outletPressure, inletEntropy);
        
        // Get inlet enthalpy
        const inletEnthalpy = this.getEnthalpy(inletPressure, inletTemp);
        
        // Return enthalpy drop
        return inletEnthalpy - outletEnthalpy;
    }
} 