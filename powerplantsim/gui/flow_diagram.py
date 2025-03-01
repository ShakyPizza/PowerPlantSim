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
        # Define positions for each key component
        x_positions = {
            "Wellhead": 10,
            "Steam Separator": 50,
            "Relief Valves": 10,
            "Moisture Sep": 300,
            "Turbine": 450,
            "Condenser": 600,
            "Cooling Tower": 750
        }
        y_positions = {
            "Wellhead": 100,
            "Steam Separator": 200,
            "Relief Valves": 300,
            "Moisture Sep": 300,
            "Turbine": 400,
            "Condenser": 500,
            "Cooling Tower": 600
        }

        # Define which side connections enter and exit each component
        connection_sides = {
            "Wellhead": ("left", "bottom"),
            "Steam Separator": ("bottom", "right"),
            "Relief Valves": ("right", "right"),
            "Moisture Sep": ("left", "right"),
            "Turbine": ("left", "right"),
            "Condenser": ("left", "right"),
            "Cooling Tower": ("left", "right")
        }

        # Create items for each major component
        for key in x_positions:
            self.create_component(key, x_positions[key], y_positions[key])

        # Define the connection order
        keys = ["Wellhead", "Steam Separator", "Relief Valves", "Moisture Sep", "Turbine", "Condenser", "Cooling Tower"]

        # Connect components using the predefined connection sides
        for i in range(len(keys) - 1):
            self.connect_items(
                self.labels[keys[i]]["box"], self.labels[keys[i + 1]]["box"],
                destination_side=connection_sides[keys[i]][1],  # Get exit side
                origin_side=connection_sides[keys[i + 1]][0]  # Get entry side
            )

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

    def connect_items(self, item_from, item_to, origin_side="right", destination_side="left"):
        """Draws a Z-shaped path (or straight line if aligned) between two items.
        Uses `origin_side` and `destination_side` to control connection placement.
        """
        pen = QPen(Qt.black, 2)
        from_rect = item_from.rect()
        to_rect = item_to.rect()

        # Determine start point based on the specified exit side
        start_point = self.get_connection_point(item_from, from_rect, destination_side)
        end_point = self.get_connection_point(item_to, to_rect, origin_side)

        # Set a low z-value so that the lines appear beneath components
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

            line1 = QGraphicsLineItem(start_point.x(), start_point.y(),
                                      mid_x, start_point.y())
            line1.setPen(pen)
            line1.setZValue(z_value)
            self._scene.addItem(line1)

            line2 = QGraphicsLineItem(mid_x, start_point.y(),
                                      mid_x, end_point.y())
            line2.setPen(pen)
            line2.setZValue(z_value)
            self._scene.addItem(line2)

            line3 = QGraphicsLineItem(mid_x, end_point.y(),
                                      end_point.x(), end_point.y())
            line3.setPen(pen)
            line3.setZValue(z_value)
            self._scene.addItem(line3)

    def get_connection_point(self, item, rect, side):
        """Returns the connection point coordinates for the specified side."""
        if side == "right":
            return item.mapToScene(rect.right(), rect.center().y())
        elif side == "left":
            return item.mapToScene(rect.left(), rect.center().y())
        elif side == "top":
            return item.mapToScene(rect.center().x(), rect.top())
        elif side == "bottom":
            return item.mapToScene(rect.center().x(), rect.bottom())

    def update_values(self, data):
        """Updates displayed values for each component."""
        for key, value in data.items():
            if key in self.labels:
                self.labels[key]["text"].setPlainText(f"Value: {value}")