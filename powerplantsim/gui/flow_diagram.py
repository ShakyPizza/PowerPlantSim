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
            "Steam Separator": 150,
            "Moisture Sep": 300,
            "Relief Valves": 150,
            "Turbine": 450,
            "Condenser": 600,
            "Cooling Tower": 750
        }
        y_positions = {
            "Wellhead": 100,
            "Steam Separator": 200,
            "Moisture Sep": 300,
            "Relief Valves": 300,
            "Turbine": 400,
            "Condenser": 500,
            "Cooling Tower": 600
        }
    
        # Create items for each major component
        self.create_component("Wellhead", x_positions["Wellhead"], y_positions["Wellhead"])
        self.create_component("Steam Separator", x_positions["Steam Separator"], y_positions["Steam Separator"])      
        self.create_component("Moisture Sep", x_positions["Moisture Sep"], y_positions["Moisture Sep"])       
        self.create_component("Relief Valves", x_positions["Relief Valves"], y_positions["Relief Valves"])     
        self.create_component("Turbine", x_positions["Turbine"], y_positions["Turbine"])
        self.create_component("Condenser", x_positions["Condenser"], y_positions["Condenser"])
        self.create_component("Cooling Tower", x_positions["Cooling Tower"], y_positions["Cooling Tower"])
    
        # Connect the items with lines
        keys = list(x_positions.keys())  
        for i in range(len(keys) - 1):
            self.connect_items(self.labels[keys[i]]["box"], self.labels[keys[i + 1]]["box"])


    def create_component(self, label, x, y):
        """Creates a component rectangle and text labels for values."""
        width, height = 120, 40
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
        """Draws a Z-shaped path (or straight line if aligned) between two items.
        The connection lines are drawn beneath the component rectangles.
        """
        pen = QPen(Qt.black, 2)
        from_rect = item_from.rect()
        to_rect = item_to.rect()

        # Get the center points in scene coordinates
        from_center = item_from.mapToScene(from_rect.center())
        to_center = item_to.mapToScene(to_rect.center())

        # Decide which edge to connect from based on horizontal positions
        if from_center.x() > to_center.x():
            # item_from is further right: connect from its left edge to item_to's right edge
            start_point = item_from.mapToScene(from_rect.left(), from_rect.center().y())
            end_point = item_to.mapToScene(to_rect.right(), to_rect.center().y())
        else:
            # item_from is to the left: connect from its right edge to item_to's left edge
            start_point = item_from.mapToScene(from_rect.right(), from_rect.center().y())
            end_point = item_to.mapToScene(to_rect.left(), to_rect.center().y())

        # Set a low z-value so that the lines appear below other items
        z_value = -1

        # If both components share the same Y coordinate, draw a single straight line.
        if start_point.y() == end_point.y():
            line = QGraphicsLineItem(start_point.x(), start_point.y(),
                                     end_point.x(), end_point.y())
            line.setPen(pen)
            line.setZValue(z_value)
            self._scene.addItem(line)
        else:
            # Draw a Z-shaped path with two 90° corners
            mid_x = (start_point.x() + end_point.x()) / 2

            # Horizontal segment from start_point.x() to mid_x
            line1 = QGraphicsLineItem(start_point.x(), start_point.y(),
                                      mid_x, start_point.y())
            line1.setPen(pen)
            line1.setZValue(z_value)
            self._scene.addItem(line1)

            # Vertical segment from start_point.y() to end_point.y()
            line2 = QGraphicsLineItem(mid_x, start_point.y(),
                                      mid_x, end_point.y())
            line2.setPen(pen)
            line2.setZValue(z_value)
            self._scene.addItem(line2)

            # Horizontal segment from mid_x to end_point.x()
            line3 = QGraphicsLineItem(mid_x, end_point.y(),
                                      end_point.x(), end_point.y())
            line3.setPen(pen)
            line3.setZValue(z_value)
            self._scene.addItem(line3)




    def update_values(self, data):
        """Updates displayed values for each component."""
        for key, value in data.items():
            if key in self.labels:
                self.labels[key]["text"].setPlainText(f"Value: {value}")
