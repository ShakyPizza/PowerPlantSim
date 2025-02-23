# powerplantsim/simulation/engine.py

from powerplantsim.simulation.components import *


class SimulationEngine:
    def __init__(self):
        
        self.wellhead = Wellhead()
        self.steamseparator = SteamSeperator()
        self.moistureseperator = MoistureSeperator()
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
            "steam_flow": None,
            "waste_water_flow": None,
            "turbine_out_power": 0.0,
            "condenser_pressure": 0.06,   # barA
            "condenser_temp": 35,      # °C
        }

    def step_simulation(self, dt=1.0):
        """
        Advances the simulation by one time-step 'dt'.
        dt could be 1 second, for example.
        """

        # 1) Update the separator with the wellhead values
        separator_result = self.steamseparator.process(
            inlet_pressure=self.state["wellhead_pressure"],
            inlet_temp=self.state["wellhead_temp"],
            inlet_flow=self.state["wellhead_flow"]
        )
        self.state["separator_pressure"] = separator_result["separator_pressure"]
        self.state["steam_flow"] = separator_result["steam_flow"]
        # ... etc., store additional separator outputs into self.state

        # 2) Update the turbine using the steam flow from the separator
        turbine_result = self.turbine.compute_mechanical_power_output(
            inlet_pressure=self.state["separator_pressure"],
            steam_flow=self.state["steam_flow"],
            outlet_pressure=self.state["condenser_pressure"]
        )
        self.state["turbine_out_power"] = turbine_result["power"]
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