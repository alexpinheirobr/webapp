import React from 'react';
import { DrawingManager } from '@react-google-maps/api';
import MapComponent from './MapComponent';

const DrawingMapComponent = ({
  center,
  zoom,
  onPolygonComplete,
  onCircleComplete,
  children
}) => {
  const [drawingManager, setDrawingManager] = React.useState(null);

  const onLoad = (drawingManager) => {
    setDrawingManager(drawingManager);
  };

  const onUnmount = () => {
    setDrawingManager(null);
  };

  const handlePolygonComplete = (polygon) => {
    if (onPolygonComplete) {
      onPolygonComplete(polygon);
    }
  };

  const handleCircleComplete = (circle) => {
    if (onCircleComplete) {
      onCircleComplete(circle);
    }
  };

  return (
    <MapComponent center={center} zoom={zoom}>
      <DrawingManager
        onLoad={onLoad}
        onUnmount={onUnmount}
        onPolygonComplete={handlePolygonComplete}
        onCircleComplete={handleCircleComplete}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              window.google.maps.drawing.OverlayType.POLYGON,
              window.google.maps.drawing.OverlayType.CIRCLE
            ]
          }
        }}
      />
      {children}
    </MapComponent>
  );
};

export default DrawingMapComponent;
