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
    
    def process(self):
        # placeholder
        return 0 

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
    def compute_mechanical_power_output(self):
        # placeholder
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
    def compute_cooling_capacity(self):
        # placeholder
        return 0
    
class CoolingTower:
    def __init__(self):
        pass
    def compute_water_cooling_capacity(self):
        # placeholder
        return 0
            
