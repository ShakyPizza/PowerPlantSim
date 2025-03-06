from PyQt5.QtWidgets import (
    QGraphicsView, QGraphicsScene, QGraphicsRectItem, QGraphicsTextItem,
    QGraphicsLineItem, QGraphicsPolygonItem, QGraphicsItem, QToolTip
)
from PyQt5.QtGui import QPainter, QPen, QBrush, QColor, QPolygonF, QFont, QPainterPath
from PyQt5.QtCore import Qt, QPointF, QRectF, QTimer
import numpy as np

class ComponentSymbol:
    """Base class for component symbols"""
    def create_symbol(self, scene, x, y, width, height):
        # Create base container
        container = QGraphicsRectItem()
        container.setRect(0, 0, width, height)  # Set local coordinates
        container.setPos(x, y)  # Set position in scene
        container.setBrush(QBrush(Qt.transparent))
        container.setPen(QPen(Qt.transparent))
        scene.addItem(container)
        return container

class WellheadSymbol(ComponentSymbol):
    def create_symbol(self, scene, x, y, width, height):
        container = super().create_symbol(scene, x, y, width, height)

        # Create wellhead symbol (trapezoid shape)
        wellhead = QGraphicsPolygonItem()
        polygon = QPolygonF([
            QPointF(width*0.2, 0),           # Top left
            QPointF(width*0.8, 0),           # Top right
            QPointF(width, height*0.8),      # Bottom right
            QPointF(0, height*0.8)           # Bottom left
        ])
        wellhead.setPolygon(polygon)
        wellhead.setBrush(QBrush(QColor("#CD853F")))  # Brown
        wellhead.setPen(QPen(Qt.black, 2))
        wellhead.setParentItem(container)

        # Add small valve indicators at the top
        valve_width = width * 0.1
        for i in range(3):
            x_pos = width * (0.3 + 0.2 * i)
            valve = QGraphicsRectItem(x_pos, 0, valve_width, height*0.1)
            valve.setBrush(QBrush(QColor("#8B4513")))
            valve.setPen(QPen(Qt.black, 1))
            valve.setParentItem(container)

        return container

class SeparatorSymbol(ComponentSymbol):
    def create_symbol(self, scene, x, y, width, height):
        container = super().create_symbol(scene, x, y, width, height)

        # Create separator vessel
        vessel = QGraphicsRectItem(0, 0, width, height)  # Local coordinates
        vessel.setBrush(QBrush(QColor("#B8B8B8")))
        vessel.setPen(QPen(Qt.black, 2))
        vessel.setParentItem(container)

        # Add internal separator line
        line = QGraphicsLineItem(0, height*0.7, width, height*0.7)
        line.setPen(QPen(Qt.black, 1, Qt.DashLine))
        line.setParentItem(container)

        return container

class TurbineSymbol(ComponentSymbol):
    def create_symbol(self, scene, x, y, width, height):
        container = super().create_symbol(scene, x, y, width, height)

        # Create turbine housing
        housing = QGraphicsRectItem(0, 0, width, height)
        housing.setBrush(QBrush(QColor("#4682B4")))
        housing.setPen(QPen(Qt.black, 2))
        housing.setParentItem(container)

        # Add turbine blades symbol
        center_x = width/2
        center_y = height/2
        radius = min(width, height) * 0.3

        for i in range(6):
            angle = i * 60
            blade = QGraphicsLineItem()
            blade.setLine(
                center_x, center_y,
                center_x + radius * np.cos(np.radians(angle)),
                center_y + radius * np.sin(np.radians(angle))
            )
            blade.setPen(QPen(Qt.white, 2))
            blade.setParentItem(container)

        return container

class CondenserSymbol(ComponentSymbol):
    def create_symbol(self, scene, x, y, width, height):
        container = super().create_symbol(scene, x, y, width, height)

        # Create condenser body
        body = QGraphicsRectItem(0, 0, width, height)
        body.setBrush(QBrush(QColor("#20B2AA")))
        body.setPen(QPen(Qt.black, 2))
        body.setParentItem(container)

        # Add cooling tubes
        tube_spacing = height / 6
        for i in range(1, 6):
            tube = QGraphicsLineItem(0, i*tube_spacing, width, i*tube_spacing)
            tube.setPen(QPen(Qt.white, 1))
            tube.setParentItem(container)

        return container

class CoolingTowerSymbol(ComponentSymbol):
    def create_symbol(self, scene, x, y, width, height):
        container = super().create_symbol(scene, x, y, width, height)

        # Create cooling tower shape (hyperbolic)
        tower = QGraphicsPolygonItem()
        polygon = QPolygonF([
            QPointF(width*0.3, 0),
            QPointF(width*0.7, 0),
            QPointF(width, height),
            QPointF(0, height)
        ])
        tower.setPolygon(polygon)
        tower.setBrush(QBrush(QColor("#A0522D")))
        tower.setPen(QPen(Qt.black, 2))
        tower.setParentItem(container)

        # Add water droplets
        for i in range(3):
            dx = width * (0.3 + 0.2*i)
            dy = height * 0.3
            droplet = QGraphicsPolygonItem()
            drop_poly = QPolygonF([
                QPointF(dx, dy),
                QPointF(dx + width*0.05, dy + height*0.1),
                QPointF(dx - width*0.05, dy + height*0.1)
            ])
            droplet.setPolygon(drop_poly)
            droplet.setBrush(QBrush(QColor("#87CEEB")))
            droplet.setPen(QPen(Qt.black, 1))
            droplet.setParentItem(container)

        return container

class FlowDiagramWidget(QGraphicsView):
    def __init__(self, parent=None):
        super().__init__(parent)
        self._scene = QGraphicsScene(self)
        self.setScene(self._scene)

        # Enable antialiasing
        self.setRenderHint(QPainter.Antialiasing, True)
        self.setRenderHint(QPainter.TextAntialiasing, True)
        self.setRenderHint(QPainter.SmoothPixmapTransform, True)

        # Set dark theme background
        self.setBackgroundBrush(QColor("#2B2B2B"))

        # Enable mouse tracking for tooltips
        self.setMouseTracking(True)

        # Set scene rect to accommodate all components
        self._scene.setSceneRect(0, 0, 1300, 800)

        # Dictionary to hold references
        self.labels = {}
        self.symbols = {}

        # Define flow colors
        self.flow_colors = {
            "steam": QColor("#E6E6E6"),  # Light gray for steam
            "water": QColor("#4169E1"),  # Royal blue for water
            "mixture": QColor("#B8860B")  # Dark golden for mixture
        }

        # Initialize the diagram
        self.create_flow_diagram()
        
        # Update scene rect to ensure all items are visible
        self._scene.setSceneRect(self._scene.itemsBoundingRect())
        
        # Fit the view to all items with some margin
        self.fitInView(self._scene.sceneRect().adjusted(-50, -50, 50, 50), Qt.KeepAspectRatio)
        
        # Set a minimum size for the widget
        self.setMinimumSize(800, 600)

    def create_flow_diagram(self):
        """Create flow diagram with components and labels."""
        # Define component positions with better spacing
        x_positions = {
            "Wellhead": 100,
            "Steam Separator": 300,
            "Relief Valves": 400,
            "Moisture Sep": 600,
            "Turbine": 800,
            "Condenser": 1000,
            "Cooling Tower": 1200
        }
        y_positions = {
            "Wellhead": 50,
            "Steam Separator": 150,
            "Relief Valves": 300,
            "Moisture Sep": 150,
            "Turbine": 300,
            "Condenser": 450,
            "Cooling Tower": 600
        }

        # Define component symbols
        component_symbols = {
            "Wellhead": WellheadSymbol(),
            "Steam Separator": SeparatorSymbol(),
            "Relief Valves": None,  # Basic rectangle for relief valves
            "Moisture Sep": SeparatorSymbol(),
            "Turbine": TurbineSymbol(),
            "Condenser": CondenserSymbol(),
            "Cooling Tower": CoolingTowerSymbol()
        }

        # Create components
        for key, symbol_class in component_symbols.items():
            if symbol_class or key == "Relief Valves":  # Include Relief Valves
                self.create_component(key, x_positions[key], y_positions[key], symbol_class)

        # Create flow connections
        # Wellhead to Steam Separator
        self.create_flow_connection(
            self.symbols["Wellhead"],
            self.symbols["Steam Separator"],
            "mixture",
            [(0.5, 1.0), (0.5, 0.0)]
        )

        # Steam Separator to Relief Valves
        self.create_flow_connection(
            self.symbols["Steam Separator"],
            self.symbols["Relief Valves"],
            "steam",
            [(1.0, 0.5), (0.0, 0.5)]
        )

        # Steam Separator to Moisture Sep
        self.create_flow_connection(
            self.symbols["Steam Separator"],
            self.symbols["Moisture Sep"],
            "steam",
            [(1.0, 0.5), (0.0, 0.5)]
        )

        # Moisture Sep to Turbine
        self.create_flow_connection(
            self.symbols["Moisture Sep"],
            self.symbols["Turbine"],
            "steam",
            [(1.0, 0.5), (0.0, 0.5)]
        )

        # Turbine to Condenser
        self.create_flow_connection(
            self.symbols["Turbine"],
            self.symbols["Condenser"],
            "mixture",
            [(1.0, 0.5), (0.0, 0.5)]
        )

        # Condenser to Cooling Tower
        self.create_flow_connection(
            self.symbols["Condenser"],
            self.symbols["Cooling Tower"],
            "water",
            [(0.5, 1.0), (0.5, 0.0)]
        )

        # Cooling Tower return to Condenser (on the left side)
        self.create_flow_connection(
            self.symbols["Cooling Tower"],
            self.symbols["Condenser"],
            "water",
            [(0.2, 0.0), (0.2, 1.0)]
        )

    def create_component(self, label, x, y, symbol_class=None):
        """Creates a component with custom symbol and value display."""
        width, height = 120, 80
        
        # Create symbol
        if symbol_class:
            container = symbol_class.create_symbol(self._scene, x, y, width, height)
        else:
            container = QGraphicsRectItem()
            container.setRect(0, 0, width, height)
            container.setPos(x, y)
            container.setBrush(QBrush(QColor("#404040")))
            container.setPen(QPen(Qt.white, 2))
            self._scene.addItem(container)
        
        # Store the container reference
        self.symbols[label] = container

        # Create label container
        label_container = QGraphicsRectItem()
        label_container.setRect(0, -30, width, height + 40)
        label_container.setPos(x, y)
        label_container.setBrush(QBrush(Qt.transparent))
        label_container.setPen(QPen(Qt.transparent))
        self._scene.addItem(label_container)

        # Add component label
        text_item = QGraphicsTextItem()
        text_item.setPlainText(label)
        text_item.setDefaultTextColor(Qt.white)
        text_item.setFont(QFont("Arial", 10, QFont.Bold))
        
        # Center the text
        text_width = text_item.boundingRect().width()
        text_item.setPos((width - text_width)/2, -25)
        text_item.setParentItem(label_container)

        # Add value display
        value_text = QGraphicsTextItem()
        value_text.setPlainText("--")
        value_text.setDefaultTextColor(QColor("#00FF00"))
        value_text.setFont(QFont("Consolas", 10))
        value_text.setPos(5, height + 5)
        value_text.setParentItem(label_container)

        # Store references
        self.labels[label] = {
            "symbol": container,
            "text": value_text,
            "container": label_container
        }

        # Add tooltip
        container.setToolTip(f"{label}\nClick for details")

    def create_flow_connection(self, from_item, to_item, flow_type, points):
        """Creates a flow connection with arrows and color coding."""
        # Get the bounding rectangles and scene positions
        from_bounds = from_item.boundingRect()
        to_bounds = to_item.boundingRect()
        from_pos = from_item.scenePos()
        to_pos = to_item.scenePos()

        # Calculate start and end points using relative positions
        start_x = from_pos.x() + from_bounds.width() * points[0][0]
        start_y = from_pos.y() + from_bounds.height() * points[0][1]
        end_x = to_pos.x() + to_bounds.width() * points[1][0]
        end_y = to_pos.y() + to_bounds.height() * points[1][1]

        # Create the connection
        start = QPointF(start_x, start_y)
        end = QPointF(end_x, end_y)

        # Create path
        path = QPainterPath()
        path.moveTo(start)

        # Create curved path if there's significant vertical difference
        if abs(start.y() - end.y()) > 10:
            ctrl1 = QPointF(start.x() + (end.x() - start.x())/3, start.y())
            ctrl2 = QPointF(start.x() + 2*(end.x() - start.x())/3, end.y())
            path.cubicTo(ctrl1, ctrl2, end)
        else:
            path.lineTo(end)

        # Create flow line
        pen = QPen(self.flow_colors[flow_type], 3)
        if flow_type == "steam":
            pen.setStyle(Qt.DashLine)
        
        path_item = self._scene.addPath(path, pen)
        path_item.setZValue(-1)

        # Add arrow
        arrow_size = 10
        angle = 20
        arrow = QPolygonF([
            end,
            end + QPointF(-arrow_size * np.cos(np.radians(angle)),
                         -arrow_size * np.sin(np.radians(angle))),
            end + QPointF(-arrow_size * np.cos(np.radians(-angle)),
                         -arrow_size * np.sin(np.radians(-angle)))
        ])
        arrow_item = QGraphicsPolygonItem(arrow)
        arrow_item.setBrush(self.flow_colors[flow_type])
        arrow_item.setPen(QPen(self.flow_colors[flow_type], 1))
        self._scene.addItem(arrow_item)

    def update_values(self, state):
        """Updates the component values with simulation data"""
        # Update wellhead values
        wellhead_text = (
            f"Pressure: {state['wellhead_pressure']:.1f} barG\n"
            f"Temperature: {state['wellhead_temp']:.1f} °C\n"
            f"Flow: {state['wellhead_flow']:.1f} kg/s"
        )
        self.labels["Wellhead"]["text"].setPlainText(wellhead_text)

        # Update separator values
        if state['separator_outlet_pressure'] is not None:
            separator_text = (
                f"Outlet Pressure: {state['separator_outlet_pressure']:.1f} barG\n"
                f"Steam Flow: {state['separator_outlet_steam_flow']:.1f} kg/s\n"
                f"Steam Temp: {state['separator_outlet_steam_temp']:.1f} °C"
            )
            self.labels["Steam Separator"]["text"].setPlainText(separator_text)

        # Update turbine values
        turbine_text = f"Power Output: {state['turbine_out_power']:.1f} MW"
        self.labels["Turbine"]["text"].setPlainText(turbine_text)

        # Update condenser values
        condenser_text = (
            f"Pressure: {state['condenser_pressure']:.3f} barA\n"
            f"Temperature: {state['condenser_temp']:.1f} °C"
        )
        self.labels["Condenser"]["text"].setPlainText(condenser_text)

        # Color-code components based on their state
        self.update_component_colors(state)

    def update_component_colors(self, state):
        """Updates component colors based on their operational state"""
        # Helper function to get color based on value range
        def get_color(value, min_val, max_val, good_range=(0.3, 0.7)):
            if value is None:
                return QColor("#808080")  # Gray for unknown state
            
            # Normalize value to 0-1 range
            normalized = (value - min_val) / (max_val - min_val)
            
            if normalized < good_range[0]:
                # Too low - use blue to yellow gradient
                ratio = normalized / good_range[0]
                return QColor(
                    int(255 * ratio),  # R
                    int(255 * ratio),  # G
                    255                # B
                )
            elif normalized > good_range[1]:
                # Too high - use yellow to red gradient
                ratio = (normalized - good_range[1]) / (1 - good_range[1])
                return QColor(
                    255,               # R
                    int(255 * (1 - ratio)),  # G
                    0                  # B
                )
            else:
                # Good range - use green
                return QColor("#32CD32")  # Lime green

        # Wellhead coloring based on pressure
        wellhead_color = get_color(
            state['wellhead_pressure'],
            min_val=8.0,    # Minimum acceptable pressure
            max_val=12.0    # Maximum acceptable pressure
        )
        self.labels["Wellhead"]["symbol"].setBrush(QBrush(wellhead_color))

        # Separator coloring based on steam flow
        if state['separator_outlet_steam_flow'] is not None:
            separator_color = get_color(
                state['separator_outlet_steam_flow'],
                min_val=70.0,   # Minimum acceptable flow
                max_val=100.0   # Maximum acceptable flow
            )
            self.labels["Steam Separator"]["symbol"].setBrush(QBrush(separator_color))

        # Turbine coloring based on power output
        turbine_color = get_color(
            state['turbine_out_power'],
            min_val=0.0,    # Minimum power
            max_val=50.0    # Maximum expected power
        )
        self.labels["Turbine"]["symbol"].setBrush(QBrush(turbine_color))

        # Condenser coloring based on pressure (vacuum)
        condenser_color = get_color(
            state['condenser_pressure'],
            min_val=0.04,   # Minimum acceptable vacuum
            max_val=0.08,   # Maximum acceptable vacuum
            good_range=(0.4, 0.6)
        )
        self.labels["Condenser"]["symbol"].setBrush(QBrush(condenser_color))

        # Add visual feedback animation
        for key in self.labels:
            original_brush = self.labels[key]["symbol"].brush()
            highlight_brush = QBrush(original_brush.color().lighter(120))
            self.labels[key]["symbol"].setBrush(highlight_brush)
            QTimer.singleShot(100, lambda k=key, b=original_brush: self.labels[k]["symbol"].setBrush(b))

    def wheelEvent(self, event):
        """Implements zoom functionality."""
        zoom_factor = 1.15
        if event.angleDelta().y() > 0:
            self.scale(zoom_factor, zoom_factor)
        else:
            self.scale(1/zoom_factor, 1/zoom_factor)

    def resizeEvent(self, event):
        """Handle resize events to maintain the view."""
        super().resizeEvent(event)
        # Update the view to show all items with margin
        self.fitInView(self._scene.sceneRect().adjusted(-50, -50, 50, 50), Qt.KeepAspectRatio)