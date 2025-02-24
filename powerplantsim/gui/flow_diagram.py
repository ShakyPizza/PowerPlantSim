# flow_diagram.py

from PyQt5.QtWidgets import (
    QGraphicsView, QGraphicsScene, QGraphicsRectItem, QGraphicsTextItem,
    QGraphicsLineItem
)
from PyQt5.QtGui import QPainter, QPen, QBrush, QColor
from PyQt5.QtCore import Qt

class FlowDiagramWidget(QGraphicsView):
    def __init__(self, parent=None):
        super().__init__(parent)
        self._scene = QGraphicsScene(self)
        self.setScene(self._scene)

        self.setRenderHint(QPainter.Antialiasing, True)
        self.setBackgroundBrush(QColor("#f0f0f0"))

        # Dictionary to hold references to component labels
        self.labels = {}

        # Initialize the diagram
        self.create_flow_diagram()

    def create_flow_diagram(self):
        """Create flow diagram with components and labels."""
        # Positions (x-coordinates) for each key component
        x_positions = {
            "Wellhead": 0,
            "Steam Separator": 150,  # Match exact name from create_component()
            "Moisture Sep": 300,
            "Turbine": 450,
            "Condenser": 600,
            "Cooling Tower": 750
        }
        y_position = 50  # Same y for a simple left-to-right flow
    
        # Create items for each major component
        self.create_component("Wellhead", x_positions["Wellhead"], y_position)
        self.create_component("Steam Separator", x_positions["Steam Separator"], y_position)
        self.create_component("Moisture Sep", x_positions["Moisture Sep"], y_position)
        self.create_component("Turbine", x_positions["Turbine"], y_position)
        self.create_component("Condenser", x_positions["Condenser"], y_position)
        self.create_component("Cooling Tower", x_positions["Cooling Tower"], y_position)
    
        # Connect the items with lines
        keys = list(x_positions.keys())  # Ensure we're using correct names
        for i in range(len(keys) - 1):
            self.connect_items(self.labels[keys[i]]["box"], self.labels[keys[i + 1]]["box"])

    def create_component(self, label, x, y):
        """Creates a component rectangle and text labels for values."""
        width, height = 80, 40
        rect_item = QGraphicsRectItem(x, y, width, height)
        rect_item.setBrush(QBrush(Qt.white))
        rect_item.setPen(QPen(Qt.black, 2))
        self._scene.addItem(rect_item)

        text_item = QGraphicsTextItem(label)
        text_item.setDefaultTextColor(Qt.black)
        text_item.setPos(x + 5, y + 5)
        self._scene.addItem(text_item)

        # Add a text label below for displaying values
        value_text = QGraphicsTextItem("Value: --")
        value_text.setDefaultTextColor(Qt.blue)
        value_text.setPos(x + 5, y + 50)  # Positioned below the component
        self._scene.addItem(value_text)

        # Store references for updates
        self.labels[label] = {"box": rect_item, "text": value_text}

    def connect_items(self, item_from, item_to):
        """Draws a simple line (arrow) from left to right."""
        pen = QPen(Qt.black, 2)
        from_rect = item_from.rect()
        to_rect = item_to.rect()

        start_point = item_from.mapToScene(from_rect.right(), from_rect.center().y())
        end_point = item_to.mapToScene(to_rect.left(), to_rect.center().y())

        line = QGraphicsLineItem(start_point.x(), start_point.y(), end_point.x(), end_point.y())
        line.setPen(pen)
        self._scene.addItem(line)

    def update_values(self, data):
        """Updates displayed values for each component."""
        for key, value in data.items():
            if key in self.labels:
                self.labels[key]["text"].setPlainText(f"Value: {value}")
