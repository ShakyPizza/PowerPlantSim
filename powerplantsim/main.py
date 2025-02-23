# powerplantsim/main.py
from powerplantsim.simulation.engine import SimulationEngine

def main():
    engine = SimulationEngine()

    print("Starting PowerPlantSim...")
    for step in range(10):  # Simulate 10 steps
        engine.step_simulation(dt=0.5)
        print(f"Step {step+1}: Turbine Power = {engine.state['turbine_out_power']} MW")

    print("Done.")

if __name__ == "__main__":
    main()