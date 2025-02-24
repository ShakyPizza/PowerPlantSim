# plots.py
# A placeholder for simple real-time or historical plotting using PyQtGraph.
# You can expand this to connect to the SimulationEngine or external data.

from PyQt5.QtWidgets import QWidget, QVBoxLayout
import pyqtgraph as pg

class PlotWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)

        # A PyQtGraph widget for plotting data
        self.plot_widget = pg.PlotWidget(title="Simulation Output")
        self.layout.addWidget(self.plot_widget)

        # Example usage: a line plot
        self.plot_data = self.plot_widget.plot([0], [0], pen="b")
        self.time_index = 0
        self.data_x = []
        self.data_y = []

    def update_plot(self, new_value):
        """
        Call this method to add new_value to the plot,
        e.g., from the simulation's output each timestep.
        """
        self.time_index += 1
        self.data_x.append(self.time_index)
        self.data_y.append(new_value)
        self.plot_data.setData(self.data_x, self.data_y)
