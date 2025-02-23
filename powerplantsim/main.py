# powerplantsim/main.py

from .simulation.engine import run_simulation_step

def main():
    print("Starting PowerPlantSim...")
    run_simulation_step()
    print("Done.")

if __name__ == "__main__":
    main()