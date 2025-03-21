export declare class IAPWS97 {
    constructor();
    
    // Steam property calculations
    h_pt(pressure: number, temperature: number): number;  // Specific enthalpy
    s_pt(pressure: number, temperature: number): number;  // Specific entropy
    v_pt(pressure: number, temperature: number): number;  // Specific volume
    h_ps(pressure: number, entropy: number): number;      // Enthalpy from pressure and entropy
    t_ps(pressure: number, entropy: number): number;      // Temperature from pressure and entropy
    t_sat_p(pressure: number): number;                    // Saturation temperature
    p_sat_t(temperature: number): number;                 // Saturation pressure
    x_pt(pressure: number, temperature: number): number;  // Steam quality
} 