# plots.py
# A placeholder for simple real-time or historical plotting using PyQtGraph.
# You can expand this to connect to the SimulationEngine or external data.

from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QComboBox, QLabel
import pyqtgraph as pg
import numpy as np

class PlotWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        # Create controls for plot configuration
        controls_layout = QHBoxLayout()
        
        # Time window selector
        self.time_window_selector = QComboBox()
        self.time_window_selector.addItems(['1 minute', '5 minutes', '15 minutes', '30 minutes', '1 hour'])
        self.time_window_selector.currentTextChanged.connect(self.update_time_window)
        controls_layout.addWidget(QLabel("Time Window:"))
        controls_layout.addWidget(self.time_window_selector)
        
        # Add stretch to push controls to the left
        controls_layout.addStretch()
        self.layout.addLayout(controls_layout)

        # Create plot widget with white background
        self.plot_widget = pg.PlotWidget()
        self.plot_widget.setBackground('w')
        self.layout.addWidget(self.plot_widget)

        # Configure plot
        self.plot_widget.setLabel('left', 'Value')
        self.plot_widget.setLabel('bottom', 'Time (s)')
        self.plot_widget.showGrid(x=True, y=True)
        self.plot_widget.addLegend()

        # Initialize data storage
        self.max_points = 3600  # Store up to 1 hour of data at 1 Hz
        self.time_data = np.zeros(self.max_points)
        self.value_data = {
            'Power Output (MW)': np.zeros(self.max_points),
            'Steam Flow (kg/s)': np.zeros(self.max_points),
            'Efficiency (%)': np.zeros(self.max_points)
        }
        
        # Create plot lines with different colors
        self.plot_lines = {}
        colors = {'Power Output (MW)': (255, 0, 0), 
                 'Steam Flow (kg/s)': (0, 255, 0),
                 'Efficiency (%)': (0, 0, 255)}
        
        for name, color in colors.items():
            self.plot_lines[name] = self.plot_widget.plot(
                self.time_data, 
                self.value_data[name],
                pen=pg.mkPen(color=color, width=2),
                name=name
            )

        self.current_index = 0
        self.start_time = 0
        self.display_window = 60  # Default to 1 minute

    def update_time_window(self, window_text):
        """Updates the time window for the plot"""
        minutes = int(window_text.split()[0])
        self.display_window = minutes * 60
        self.update_plot_range()

    def update_plot_range(self):
        """Updates the visible range of the plot"""
        if self.current_index > 0:
            self.plot_widget.setXRange(
                max(0, self.time_data[self.current_index-1] - self.display_window),
                self.time_data[self.current_index-1]
            )

    def reset_plot(self):
        """Resets all plot data"""
        self.current_index = 0
        self.start_time = 0
        self.time_data.fill(0)
        for data in self.value_data.values():
            data.fill(0)
        self.update_plot_range()

    def update_plot(self, power_output, steam_flow=None, efficiency=None):
        """
        Updates the plot with new values.
        
        Args:
            power_output (float): Current power output in MW
            steam_flow (float): Current steam flow in kg/s
            efficiency (float): Current efficiency in %
        """
        # Update time data
        current_time = self.current_index
        self.time_data[self.current_index] = current_time
        
        # Update value data
        self.value_data['Power Output (MW)'][self.current_index] = power_output
        if steam_flow is not None:
            self.value_data['Steam Flow (kg/s)'][self.current_index] = steam_flow
        if efficiency is not None:
            self.value_data['Efficiency (%)'][self.current_index] = efficiency

        # Update plot lines
        for name, line in self.plot_lines.items():
            line.setData(
                self.time_data[:self.current_index+1],
                self.value_data[name][:self.current_index+1]
            )

        # Increment index and wrap around if necessary
        self.current_index = (self.current_index + 1) % self.max_points

        # Update visible range
        self.update_plot_range()
