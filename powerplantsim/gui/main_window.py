import sys
import random
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QHBoxLayout, QPushButton, QVBoxLayout
from flow_diagram import FlowDiagramWidget
from plots import PlotWidget
from PyQt5.QtCore import QTimer

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PowerPlantSim Overview")
        self.resize(1000, 600)

        # Central widget container
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Layout that holds the flow diagram on the left and plot area on the right
        main_layout = QHBoxLayout()
        central_widget.setLayout(main_layout)

        # Flow diagram
        self.flow_diagram = FlowDiagramWidget()
        main_layout.addWidget(self.flow_diagram)

        # Plot widget
        self.plot_widget = PlotWidget()
        main_layout.addWidget(self.plot_widget)

        # Add a button to manually update values (for testing)
        control_layout = QVBoxLayout()
        self.update_button = QPushButton("Update Values")
        self.update_button.clicked.connect(self.update_simulation_values)
        control_layout.addWidget(self.update_button)
        main_layout.addLayout(control_layout)

        # Timer to automatically update simulation values every second
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_simulation_values)
        self.timer.start(1000)  # Update every second

    def update_simulation_values(self):
        """Simulate updated data and push it to the GUI."""
        new_data = {
            "Wellhead": f"{random.uniform(90, 110):.1f} kg/s",
            "Steam Separator": f"{random.uniform(77, 80):.1f} kg/s",
            "Moisture Sep": f"{random.uniform(70, 77):.1f} kg/s",
            "Turbine": f"{random.uniform(44.8, 47.2):.1f} MW",
            "Condenser": f"{random.uniform(33, 36):.1f} °C",
            "Cooling Tower": f"{random.uniform(20, 21):.1f} °C"
        }

        # Update flow diagram
        self.flow_diagram.update_values(new_data)

        # Update plot (for example, tracking turbine power output)
        self.plot_widget.update_plot(float(new_data["Turbine"].split()[0]))

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
