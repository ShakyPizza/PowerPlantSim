# flow_diagram.py
# A simple flow diagram of the power plant process from left (Wellhead) to right (Cooling Tower).

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

        # Enable antialiasing
        self.setRenderHint(QPainter.Antialiasing, True)

        # Optionally, to preserve existing hints:
        # existing_hints = self.renderHints()
        # self.setRenderHints(existing_hints | QPainter.Antialiasing)

        self.setBackgroundBrush(QColor("#f0f0f0"))

        # Initialize the diagram
        self.create_flow_diagram()

    def create_flow_diagram(self):
        # Positions (x-coordinates) for each key component
        x_positions = {
            "Wellhead": 0,
            "Separator": 150,
            "MoistureSeparator": 300,
            "Turbine": 450,
            "Condenser": 600,
            "CoolingTower": 750
        }
        y_position = 50  # same y for a simple left-to-right flow

        # Create items for each major component
        wellhead_item = self.create_component("Wellhead", x_positions["Wellhead"], y_position)
        separator_item = self.create_component("Steam Separator", x_positions["Separator"], y_position)
        moisture_sep_item = self.create_component("Moisture Sep", x_positions["MoistureSeparator"], y_position)
        turbine_item = self.create_component("Turbine", x_positions["Turbine"], y_position)
        condenser_item = self.create_component("Condenser", x_positions["Condenser"], y_position)
        cooling_tower_item = self.create_component("Cooling Tower", x_positions["CoolingTower"], y_position)

        # Create lines (arrows) from left to right
        self.connect_items(wellhead_item, separator_item)
        self.connect_items(separator_item, moisture_sep_item)
        self.connect_items(moisture_sep_item, turbine_item)
        self.connect_items(turbine_item, condenser_item)
        self.connect_items(condenser_item, cooling_tower_item)

    def create_component(self, label, x, y):
        """
        Creates a rectangular item with a text label to represent a component.
        Returns the rectangle item so it can be connected with lines.
        """
        width, height = 80, 40
        rect_item = QGraphicsRectItem(x, y, width, height)
        rect_item.setBrush(QBrush(Qt.white))
        rect_item.setPen(QPen(Qt.black, 2))
        self._scene.addItem(rect_item)

        text_item = QGraphicsTextItem(label)
        text_item.setDefaultTextColor(Qt.black)
        text_item.setPos(x + 5, y + 5)
        self._scene.addItem(text_item)

        return rect_item

    def connect_items(self, item_from, item_to):
        """
        Draws a simple line (arrow) from the center-right of item_from
        to the center-left of item_to.
        """
        pen = QPen(Qt.black, 2)
        from_rect = item_from.rect()
        to_rect = item_to.rect()

        start_point = item_from.mapToScene(from_rect.right(), from_rect.center().y())
        end_point = item_to.mapToScene(to_rect.left(), to_rect.center().y())

        line = QGraphicsLineItem(start_point.x(), start_point.y(), end_point.x(), end_point.y())
        line.setPen(pen)
        self._scene.addItem(line)
