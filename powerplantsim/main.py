# powerplantsim/main.py

from .simulation.engine import step_simulation

def main():
    print("Starting PowerPlantSim...")
    step_simulation()
    print("Done.")

if __name__ == "__main__":
    main()