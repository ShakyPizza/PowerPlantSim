# powerplantsim/main.py
from powerplantsim.simulation.engine import SimulationEngine

def main():
    engine = SimulationEngine()

    print("Starting PowerPlantSim...")
    for step in range(1):  # Simulate 10 steps
        engine.step_simulation(dt=1.0)
        print(f"Step {step+1}: Turbine Power = {engine.state['turbine_out_power']} MW")
        print(f"Step {step+1}: Steam Flow = {engine.state['steam_flow']} kg/s")
        print(f"Step {step+1}: Turbine Inlet Pressure = {engine.state['separator_pressure']} bar")

    print("Done.")

if __name__ == "__main__":
    main()