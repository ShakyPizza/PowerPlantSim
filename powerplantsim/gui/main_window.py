# main_window.py
# The main window of the application that combines the FlowDiagramWidget and PlotWidget side by side.

import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QHBoxLayout
from flow_diagram import FlowDiagramWidget
from plots import PlotWidget

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("PowerPlantSim Overview")
        self.resize(1000, 600)

        # Central widget container
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Layout that holds the flow diagram on the left and plot area on the right
        layout = QHBoxLayout()
        central_widget.setLayout(layout)

        # Flow diagram
        self.flow_diagram = FlowDiagramWidget()
        layout.addWidget(self.flow_diagram)

        # Plot widget
        self.plot_widget = PlotWidget()
        layout.addWidget(self.plot_widget)

        # For demonstration, let's add some dummy data to the plot
        self.populate_example_data()

    def populate_example_data(self):
        # In a real app, you'd update the plot as the simulation steps forward.
        # For now, let's just feed some random data as a placeholder.
        import random
        for i in range(50):
            val = random.uniform(0, 100)
            self.plot_widget.update_plot(val)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
