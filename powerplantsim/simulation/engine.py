# powerplantsim/simulation/engine.py

from powerplantsim.simulation.components import *


class SimulationEngine:
    def __init__(self):
        
        self.wellhead = Wellhead()
        self.steamseparator = SteamSeparator()
        self.moistureseparator = MoistureSeparator()
        self.turbine = SteamTurbine()
        self.condenser = Condenser()
        self.generator = Generator()
        self.coolingtower = CoolingTower()
        self.relifvalve = ReliefValve()

        # Create an initial state
        self.state = {
            "wellhead_pressure": 10.5,   # barG
            "wellhead_temp": 186.1,      # °C
            "wellhead_flow": 180,      # kg/s
            "separator_pressure": None,
            "separator_steam_flow": None,
            "separator_steam_temp": None,
            "waste_water_flow": None,
            "turbine_out_power": 0.0,
            "steam_flow": None,
            "condenser_pressure": 0.06,   # barA
            "condenser_temp": 35,      # °C
        }

    def step_simulation(self, dt=1.0):
        """
        Advances the simulation by one time-step 'dt'.
        """

        # 1) Update the separator with the wellhead values
        separator_result = self.steamseparator.process(
            separator_inlet_pressure=self.state["wellhead_pressure"],
            separator_inlet_temp=self.state["wellhead_temp"],
            separator_inlet_flow=self.state["wellhead_flow"]
        )
        self.state["separator_pressure"] = separator_result["separator_pressure"]
        self.state["separator_steam_flow"] = separator_result["separator_steam_flow"]
        self.state["separator_steam_temp"] = separator_result["separator_steam_temp"]
        self.state["steam_flow"] = self.state["separator_steam_flow"]

        # 2) Update the turbine using the steam flow from the separator
        turbine_result = self.turbine.compute_mechanical_power_output(
            turbine_inlet_pressure=self.state["separator_pressure"],
            turbine_inlet_steam_flow=self.state["separator_steam_flow"] / 4,
            turbine_outlet_pressure=self.state["condenser_pressure"]
        )
        self.state["turbine_out_power"] = turbine_result["mechanical_power"]
        # ... store additional turbine outputs in self.state (mass flow out, etc.)

        # 3) Update the condenser
        condenser_result = self.condenser.compute_cooling_capacity(
            inlet_flow=self.state["steam_flow"],
            inlet_temp=self.state["wellhead_temp"],     # or from turbine exhaust
            dt=dt
        )
        self.state["condenser_pressure"] = condenser_result["pressure"]
        self.state["condenser_temp"] = condenser_result["temperature"]
        # ... etc.

        # 4) Possibly handle control loops (e.g., a PID for valve or pressure control)
        # self.update_controllers(dt)

        # The state is now updated for this time step.
        # The next call to step_simulation() will build on these updated values.