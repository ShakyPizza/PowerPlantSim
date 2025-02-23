class Wellhead:
    def __init__(self):
        pass
    def compute_steam_output(Wellhead_pressure, Wellhead_flow):
        SteamFromWellHead = Wellhead_pressure * Wellhead_flow
        return {
            "Steam_from_wellhead": SteamFromWellHead
        }
    
class SteamSeperator:
    def __init__(self):
        pass
    def compute_waste_water(SteamFromWellhead, waste_index):
        waste_water_flow =  SteamFromWellhead * waste_index 
        return {
            "waste_water_flow": waste_water_flow
        }

    def waste_water_energy(waste_water_flow, Wellhead_pressure, steam_seperator_temperature):
        waste_water_energy = waste_water_flow * steam_seperator_temperature                   #Finna function fyrir útreikning á varma í vatninu.
        return 1
    
    def compute_steam_forward(SteamFromWellhead, waste_water_energy):
        steam_forward = SteamFromWellhead - waste_water_energy
        return 0
    
    def process(self, inlet_pressure, inlet_temp, inlet_flow):
        # Stub logic
        # In a real scenario, you'd calculate the fraction that becomes steam,
        # the pressure drop, etc.
        return {
            "separator_pressure": inlet_pressure - 2,  # pretend we drop 2 bar
            "steam_flow": inlet_flow * 0.8,            # 80% becomes steam, for example
        }

class MoistureSeperator:
    def __init__(self):
        pass
    def compute_waste_water(self):
        # placeholder
        return 0

class ReliefValve:
    def __init__(self):
        pass
    def compute_valve_opening(self):
        # placeholder
        return 0

class SteamTurbine:
    def __init__(self):
        pass
    def compute_mechanical_power_output(self, inlet_pressure, steam_flow, outlet_pressure):
        # Stub logic
        mechanical_power_generated = steam_flow * (inlet_pressure - outlet_pressure) * 10  # Dummy formula
        return {
            "mechanical_power": mechanical_power_generated
        }
        
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
            
