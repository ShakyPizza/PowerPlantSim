import sys
import random
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QHBoxLayout, QPushButton, QVBoxLayout,
    QLabel, QSlider, QGroupBox, QGridLayout, QLCDNumber, QFrame, QStatusBar
)
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QPalette, QColor
from flow_diagram import FlowDiagramWidget
from plots import PlotWidget
from powerplantsim.simulation.engine import SimulationEngine

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PowerPlantSim Overview")
        self.resize(1800, 900)  # Increased height for additional controls
        
        # Add status bar
        self.statusBar = QStatusBar()
        self.setStatusBar(self.statusBar)
        self.statusBar.showMessage("Simulation running...")

        # Initialize simulation engine first
        self.simulation_engine = SimulationEngine()
        self.simulation_time = 0.0
        self.dt = 0.1  # simulation time step in seconds

        # Central widget container
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Main layout (horizontal)
        main_layout = QHBoxLayout()
        central_widget.setLayout(main_layout)

        # Left panel for flow diagram (60% of width)
        left_panel = QWidget()
        left_layout = QVBoxLayout()
        left_panel.setLayout(left_layout)
        main_layout.addWidget(left_panel, 60)

        # Flow diagram
        self.flow_diagram = FlowDiagramWidget()
        left_layout.addWidget(self.flow_diagram)

        # Right panel for controls and plots (40% of width)
        right_panel = QWidget()
        right_layout = QVBoxLayout()
        right_panel.setLayout(right_layout)
        main_layout.addWidget(right_panel, 40)

        # Add control panels
        self.create_simulation_controls(right_layout)
        self.create_plant_controls(right_layout)
        
        # Plot widget
        plot_group = QGroupBox("Real-time Monitoring")
        plot_layout = QVBoxLayout()
        self.plot_widget = PlotWidget()
        plot_layout.addWidget(self.plot_widget)
        plot_group.setLayout(plot_layout)
        right_layout.addWidget(plot_group)

        # Digital display panel for key metrics
        self.create_digital_display(right_layout)

        # Timer setup
        self.simulation_running = False
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_simulation_values)

    def create_simulation_controls(self, parent_layout):
        """Creates the simulation control panel"""
        sim_group = QGroupBox("Simulation Controls")
        sim_layout = QHBoxLayout()

        # Start/Stop button
        self.start_stop_btn = QPushButton("Start")
        self.start_stop_btn.clicked.connect(self.toggle_simulation)
        sim_layout.addWidget(self.start_stop_btn)

        # Reset button
        reset_btn = QPushButton("Reset")
        reset_btn.clicked.connect(self.reset_simulation)
        sim_layout.addWidget(reset_btn)

        # Speed control
        self.speed_slider = QSlider(Qt.Horizontal)
        self.speed_slider.setMinimum(1)
        self.speed_slider.setMaximum(20)
        self.speed_slider.setValue(10)
        self.speed_slider.setTickPosition(QSlider.TicksBelow)
        sim_layout.addWidget(self.speed_slider)
        sim_layout.addWidget(QLabel("Speed"))

        sim_group.setLayout(sim_layout)
        parent_layout.addWidget(sim_group)

    def create_plant_controls(self, parent_layout):
        """Creates the plant control panel with sliders"""
        control_group = QGroupBox("Plant Controls")
        control_layout = QGridLayout()

        # Initialize slider dictionaries
        self.sliders = {}
        self.labels = {}
        self.value_labels = {}

        # Define controls with ranges and units
        controls = {
            "Wellhead Pressure": {"min": 5, "max": 20, "default": 10.5, "unit": "barG"},
            "Wellhead Temperature": {"min": 150, "max": 200, "default": 178, "unit": "°C"},
            "Wellhead Flow": {"min": 50, "max": 150, "default": 85, "unit": "kg/s"},
            "Turbine Load": {"min": 0, "max": 100, "default": 80, "unit": "%"},
            "Cooling Tower Fan Speed": {"min": 0, "max": 100, "default": 70, "unit": "%"}
        }

        # Create controls
        for i, (name, params) in enumerate(controls.items()):
            self.add_control(control_layout, i, name, params)
            
            # Initialize with simulation state values if available
            if name == "Wellhead Pressure":
                self.sliders[name].setValue(int(self.simulation_engine.state["wellhead_pressure"] * 10))
            elif name == "Wellhead Temperature":
                self.sliders[name].setValue(int(self.simulation_engine.state["wellhead_temp"] * 10))
            elif name == "Wellhead Flow":
                self.sliders[name].setValue(int(self.simulation_engine.state["wellhead_flow"] * 10))
            elif name == "Turbine Load":
                # Convert power output to percentage
                max_power = 50.0
                power_percent = (self.simulation_engine.state["turbine_out_power"] / max_power) * 100
                self.sliders[name].setValue(int(power_percent * 10))
            elif name == "Cooling Tower Fan Speed":
                # Convert condenser temperature to fan speed percentage
                base_temp = 35.0
                temp_range = 10.0
                current_temp = self.simulation_engine.state["condenser_temp"]
                fan_speed = 100 - ((current_temp - base_temp) / temp_range * 100)
                self.sliders[name].setValue(int(fan_speed * 10))

        control_group.setLayout(control_layout)
        parent_layout.addWidget(control_group)

    def create_digital_display(self, parent_layout):
        """Creates a panel with digital displays for key metrics"""
        display_group = QGroupBox("Key Metrics")
        display_layout = QGridLayout()

        self.displays = {}
        metrics = [
            "Wellhead Pressure", "Wellhead Temperature", "Wellhead Flow",
            "Separator Pressure", "Steam Flow", "Turbine Power",
            "Condenser Pressure", "Condenser Temperature"
        ]

        for i, metric in enumerate(metrics):
            lcd = QLCDNumber()
            lcd.setSegmentStyle(QLCDNumber.Flat)
            lcd.setDigitCount(6)
            lcd.display(0.0)
            
            # Set a fixed size for consistent appearance
            lcd.setMinimumHeight(50)
            
            # Add label and LCD
            display_layout.addWidget(QLabel(metric), i, 0)
            display_layout.addWidget(lcd, i, 1)
            
            self.displays[metric] = lcd

        display_group.setLayout(display_layout)
        parent_layout.addWidget(display_group)

    def add_control(self, layout, row, label, params):
        """Adds a labeled slider with value display to the layout"""
        # Label
        layout.addWidget(QLabel(label), row, 0)

        # Slider
        slider = QSlider(Qt.Horizontal)
        slider.setMinimum(params["min"] * 10)
        slider.setMaximum(params["max"] * 10)
        slider.setValue(int(params["default"] * 10))
        slider.setTickPosition(QSlider.TicksBelow)
        slider.valueChanged.connect(lambda: self.slider_changed(label))
        layout.addWidget(slider, row, 1)
        self.sliders[label] = slider

        # Value label
        value_label = QLabel(f"{params['default']} {params['unit']}")
        layout.addWidget(value_label, row, 2)
        self.value_labels[label] = value_label

    def slider_changed(self, label):
        """Updates value label when a slider is moved and updates simulation state"""
        value = self.sliders[label].value() / 10
        self.value_labels[label].setText(f"{value} {self.get_unit(label)}")
        
        # Update simulation state based on slider changes
        if label == "Wellhead Pressure":
            self.simulation_engine.state["wellhead_pressure"] = value
        elif label == "Wellhead Temperature":
            self.simulation_engine.state["wellhead_temp"] = value
        elif label == "Wellhead Flow":
            self.simulation_engine.state["wellhead_flow"] = value
        elif label == "Turbine Load":
            # Convert percentage to actual power output
            max_power = 50.0  # Maximum power output in MW
            self.simulation_engine.state["turbine_out_power"] = (value / 100.0) * max_power
        elif label == "Cooling Tower Fan Speed":
            # Adjust condenser temperature based on fan speed
            base_temp = 35.0  # Base condenser temperature
            temp_range = 10.0  # Temperature range affected by fan speed
            self.simulation_engine.state["condenser_temp"] = base_temp + (100 - value) / 100.0 * temp_range
        
        # Update displays with new simulation values
        self.update_simulation_values()
        self.statusBar.showMessage(f"Adjusted {label} to {value} {self.get_unit(label)}")

    def toggle_simulation(self):
        """Start/Stop the simulation"""
        self.simulation_running = not self.simulation_running
        if self.simulation_running:
            self.start_stop_btn.setText("Stop")
            self.timer.start(1000 // self.speed_slider.value())
            self.statusBar.showMessage("Simulation running...")
        else:
            self.start_stop_btn.setText("Start")
            self.timer.stop()
            self.statusBar.showMessage("Simulation paused")

    def reset_simulation(self):
        """Reset the simulation to initial conditions"""
        self.simulation_running = False
        self.simulation_time = 0.0
        self.simulation_engine = SimulationEngine()  # Create fresh simulation
        self.start_stop_btn.setText("Start")
        self.update_simulation_values()  # Update displays with initial values

    def update_simulation_values(self):
        """Update all display values from the simulation engine"""
        if self.simulation_running:
            # Step the simulation forward
            self.simulation_engine.step_simulation(self.dt)
            self.simulation_time += self.dt

            # Update displays with actual simulation values
            state = self.simulation_engine.state
            
            # Update wellhead values
            self.displays["Wellhead Pressure"].display(f"{state['wellhead_pressure']:.1f}")
            self.displays["Wellhead Temperature"].display(f"{state['wellhead_temp']:.1f}")
            self.displays["Wellhead Flow"].display(f"{state['wellhead_flow']:.1f}")
            
            # Update separator values
            if state['separator_outlet_pressure'] is not None:
                self.displays["Separator Pressure"].display(f"{state['separator_outlet_pressure']:.1f}")
            if state['separator_outlet_steam_flow'] is not None:
                self.displays["Steam Flow"].display(f"{state['separator_outlet_steam_flow']:.1f}")
            
            # Update turbine values
            self.displays["Turbine Power"].display(f"{state['turbine_out_power']:.1f}")
            
            # Update condenser values
            self.displays["Condenser Pressure"].display(f"{state['condenser_pressure']:.3f}")
            self.displays["Condenser Temperature"].display(f"{state['condenser_temp']:.1f}")

            # Update status bar with simulation time
            self.statusBar.showMessage(f"Simulation running... Time: {self.simulation_time:.1f} s")

            # Update flow diagram
            self.flow_diagram.update_values(state)

    def get_unit(self, label):
        """Returns the appropriate unit for each control"""
        units = {
            "Wellhead Pressure": "barG",
            "Wellhead Temperature": "°C",
            "Wellhead Flow": "kg/s",
            "Turbine Load": "%",
            "Cooling Tower Fan Speed": "%"
        }
        return units.get(label, "")

def main():
    app = QApplication(sys.argv)
    
    # Set application style
    app.setStyle("Fusion")
    
    # Create dark palette
    palette = QPalette()
    palette.setColor(QPalette.Window, QColor(53, 53, 53))
    palette.setColor(QPalette.WindowText, Qt.white)
    palette.setColor(QPalette.Base, QColor(25, 25, 25))
    palette.setColor(QPalette.AlternateBase, QColor(53, 53, 53))
    palette.setColor(QPalette.ToolTipBase, Qt.white)
    palette.setColor(QPalette.ToolTipText, Qt.white)
    palette.setColor(QPalette.Text, Qt.white)
    palette.setColor(QPalette.Button, QColor(53, 53, 53))
    palette.setColor(QPalette.ButtonText, Qt.white)
    palette.setColor(QPalette.BrightText, Qt.red)
    palette.setColor(QPalette.Link, QColor(42, 130, 218))
    palette.setColor(QPalette.Highlight, QColor(42, 130, 218))
    palette.setColor(QPalette.HighlightedText, Qt.black)
    
    app.setPalette(palette)
    
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()