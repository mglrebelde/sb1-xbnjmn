import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Business } from '../types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapProps {
  businesses: Business[];
}

const Map: React.FC<MapProps> = ({ businesses }) => {
  const ulaanbaatarPosition: [number, number] = [47.9184, 106.9177]; // Coordinates for Ulaanbaatar city center

  // Fix for default marker icon
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });

  return (
    <div className="map-container">
      <MapContainer center={ulaanbaatarPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {businesses.map((business) => (
          <Marker key={business.id} position={[business.latitude, business.longitude]}>
            <Popup>
              <div>
                <h3 className="font-bold">{business.name}</h3>
                <p>{business.category}</p>
                <p>{business.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;