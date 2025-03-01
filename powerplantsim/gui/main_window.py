import sys
import random
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QHBoxLayout, QPushButton, QVBoxLayout, QLabel, QSlider
)
from PyQt5.QtCore import Qt, QTimer
from flow_diagram import FlowDiagramWidget
from plots import PlotWidget

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PowerPlantSim Overview")
        self.resize(1800, 600)  # Increased width for sliders

        # Central widget container
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Main layout (horizontal) containing:
        # 1. Flow diagram
        # 2. Plot
        # 3. Control Panel (Sliders)
        main_layout = QHBoxLayout()
        central_widget.setLayout(main_layout)

        # Flow diagram
        self.flow_diagram = FlowDiagramWidget()
        main_layout.addWidget(self.flow_diagram)

        # Plot widget
        self.plot_widget = PlotWidget()
        main_layout.addWidget(self.plot_widget)

        # Control Panel Layout (Sliders)
        control_layout = QVBoxLayout()
        main_layout.addLayout(control_layout)

        # Sliders for Wellhead Pressure, Temperature, and Flow
        self.sliders = {}
        self.labels = {}

        self.add_slider("Wellhead Pressure", 5, 20, 10.5, control_layout)
        self.add_slider("Wellhead Temperature", 150, 200, 178, control_layout)
        self.add_slider("Wellhead Flow", 50, 150, 85, control_layout)

        # Button to manually update values (for testing)
        self.update_button = QPushButton("Update Values")
        self.update_button.clicked.connect(self.update_simulation_values)
        control_layout.addWidget(self.update_button)

        # Timer to automatically update simulation values every second
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_simulation_values)
        self.timer.start(1000)  # Update every second

    def add_slider(self, label, min_val, max_val, default, layout):
        """Creates a labeled slider for adjusting values"""
        slider_label = QLabel(f"{label}: {default} {self.get_unit(label)}")
        layout.addWidget(slider_label)

        slider = QSlider(Qt.Horizontal)
        slider.setMinimum(min_val * 10)  # Multiply by 10 for better precision
        slider.setMaximum(max_val * 10)
        slider.setValue(int(round(default)) * 10)
        slider.setTickInterval((max_val - min_val) * 10 // 5)
        slider.setTickPosition(QSlider.TicksBelow)
        slider.valueChanged.connect(lambda: self.slider_changed(label))
        layout.addWidget(slider)

        self.sliders[label] = slider
        self.labels[label] = slider_label

    def slider_changed(self, label):
        """Updates label text when a slider is moved"""
        value = self.sliders[label].value() / 10  # Convert back to decimal
        self.labels[label].setText(f"{label}: {value} {self.get_unit(label)}")

    def get_unit(self, label):
        """Returns the appropriate unit for each slider"""
        units = {
            "Wellhead Pressure": "barG",
            "Wellhead Temperature": "°C",
            "Wellhead Flow": "kg/s"
        }
        return units.get(label, "")

    def update_simulation_values(self):
        """Get values from sliders and update the GUI"""
        new_data = {
            "Wellhead": f"{self.sliders['Wellhead Flow'].value() / 10:.1f} kg/s",
            "Wellhead Temp": f"{self.sliders['Wellhead Temperature'].value() / 10:.1f} °C",
            "Steam Separator": f"{random.uniform(85, 100):.1f} kg/s",
            "Moisture Sep": f"{random.uniform(80, 95):.1f} kg/s",
            "Relief Valves": f"{random.uniform(0,15):.1f} %",
            "Turbine": f"{random.uniform(5, 20):.1f} MW",
            "Condenser": f"{random.uniform(30, 40):.1f} °C",
            "Cooling Tower": f"{random.uniform(25, 35):.1f} °C"
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