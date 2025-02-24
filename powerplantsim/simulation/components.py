# powerplantsim/simulation/components.py

from iapws import IAPWS97
class Wellhead:
    def __init__(self):
        pass
    def compute_steam_output(self, wellhead_pressure, wellhead_flow):
        steam_from_wellhead = wellhead_pressure * wellhead_flow
        return {
            "steam_from_wellhead": steam_from_wellhead
        }

class ReliefValve:
    def __init__(self):
        pass
    def compute_valve_opening(self):
        return 0

class SteamSeparator:
    def __init__(self):
        pass    
    def process(self, separator_inlet_pressure, separator_inlet_temp, separator_inlet_flow):
        # Stub logic
        # In a real scenario, you'd calculate the fraction that becomes steam,
        # the pressure drop, etc.
        return {
            "separator_outlet_pressure": separator_inlet_pressure - 2,                # pretend we drop 2 bar
            "separator_outlet_steam_flow": separator_inlet_flow * 0.9,                  # 80% becomes steam, for example
            "separator_outlet_steam_temp": round(separator_inlet_temp * 0.995, 3),                 # assume 
        }

class MoistureSeparator:
    def __init__(self):
        pass
    def compute_waste_water(self):
        # placeholder
        return 0
    def process(self, separator_outlet_pressure, inlet_temp, inlet_flow):
        return {
            "turbine_inlet_pressure": separator_outlet_pressure - 0.5,     # assume 0.5 bar pressure drop
            "turbine_inlet_temp": inlet_temp * 0.995,               # assume 0.995 heat index
            "turbine_inlet_flow": inlet_flow * 0.99,                # assume .99 flow index
        }
    

class ReliefValve:
    def __init__(self):
        pass
    def compute_valve_opening(self):
        return 0
        
class Generator:
    def __init__(self):
        pass
    def compute_electric_power_output(self):
        # placeholder
        return 0
    
class Condenser:
    def __init__(self):
        pass
    def compute_cooling_capacity(self, inlet_flow, inlet_temp, dt):
        # Stub logic
        # Maybe you model some cooling over time
        new_pressure = 0.1  # bar
        new_temp = 40.0
        return {
            "pressure": new_pressure,
            "temperature": new_temp
        }
    
class CoolingTower:
    def __init__(self):
        pass
    def compute_cooling(self):
        return 0
            
class SteamTurbine:
    def __init__(self, efficiency=0.223):
        self.efficiency = efficiency

    def compute_mechanical_power_output(self, turbine_inlet_pressure, turbine_inlet_temp, turbine_inlet_steam_flow, turbine_outlet_pressure):
        
        # Convert pressures from bar to MPa (1 bar = 0.1 MPa)
        p_in = turbine_inlet_pressure * 0.1  
        p_out = turbine_outlet_pressure * 0.1  
        # Convert temperature from °C to Kelvin
        T_in = turbine_inlet_temp + 273.15

        # Get inlet state properties using iapws
        inlet_state = IAPWS97(P=p_in, T=T_in)
        h_in = inlet_state.h  # Enthalpy in kJ/kg

        h_drop_ideal = (p_in - p_out) / p_in * h_in  
        h_out_isentropic = h_in - h_drop_ideal

        # Apply turbine efficiency to get the actual outlet enthalpy.
        h_out = h_in - self.efficiency * (h_in - h_out_isentropic)

        # Mechanical power (in kW) is mass flow (kg/s) * enthalpy drop (kJ/kg)
        power_kW = turbine_inlet_steam_flow * (h_in - h_out)
        # Convert kW to MW
        power_MW = power_kW / 1e3

        return {"mechanical_power": round(power_MW, 3)}