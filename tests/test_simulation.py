import unittest
from powerplantsim.simulation.engine import run_simulation_step

class TestEngine(unittest.TestCase):
    def test_run_simulation_step(self):
        # Just verify it doesn't crash.
        run_simulation_step()

if __name__ == "__main__":
    unittest.main()