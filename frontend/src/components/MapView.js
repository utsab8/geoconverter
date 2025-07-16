import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, ZoomControl, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

const { BaseLayer } = LayersControl;

const DEFAULT_POSITION = [27.7172, 85.3240]; // Kathmandu, Nepal
const DEFAULT_ZOOM = 13;

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
}

const MapView = ({ features = [], loading = false, onMapClick, onMarkerClick }) => {
  const [center, setCenter] = useState(DEFAULT_POSITION);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ show: false, feature: null });
  const mapRef = useRef();
  const [mapHeight, setMapHeight] = useState('60vh');

  // Responsive map height
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setMapHeight('40vh');
      } else {
        setMapHeight('60vh');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Performance: limit features for huge datasets (show warning)
  const MAX_MARKERS = 2000;
  const tooManyMarkers = features.length > MAX_MARKERS;
  const displayedFeatures = tooManyMarkers ? features.slice(0, MAX_MARKERS) : features;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
    const data = await res.json();
    if (data && data[0]) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setCenter([lat, lon]);
      if (mapRef.current) {
        mapRef.current.setView([lat, lon], 13);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Search Box */}
      <form className="d-flex mb-2" onSubmit={handleSearch} style={{ maxWidth: 400 }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-primary" type="submit">Search</button>
      </form>
      {/* Legend */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, background: 'white', padding: 8, borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <strong>Legend</strong>
        <div><span style={{ color: 'blue' }}>●</span> Data Point</div>
      </div>
      {/* Export Button (scaffold) */}
      <button className="btn btn-sm btn-secondary" style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1000 }} onClick={() => alert('Map export coming soon!')}>Export Map</button>
      {loading && (
        <div style={{
          position: 'absolute', zIndex: 1000, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="spinner-border text-primary" role="status" style={{ width: 60, height: 60 }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {tooManyMarkers && (
        <div className="alert alert-warning" style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          Showing first {MAX_MARKERS} markers out of {features.length} for performance.
        </div>
      )}
      <MapContainer center={center} zoom={DEFAULT_ZOOM} style={{ height: mapHeight, width: '100%' }} zoomControl={false} whenCreated={mapInstance => (mapRef.current = mapInstance)}>
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="Topo Map">
            <TileLayer
              attribution='Map data: &copy; OpenTopoMap (CC-BY-SA)'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
        </LayersControl>
        <ZoomControl position="bottomright" />
        <MapClickHandler onMapClick={onMapClick} />
        {displayedFeatures.length > 0 && (
          <MarkerClusterGroup chunkedLoading maxClusterRadius={60}>
            {displayedFeatures.map((f, idx) => (
              <Marker key={idx} position={[f.lat, f.lng]} icon={customIcon} eventHandlers={{ click: () => setModal({ show: true, feature: f }) }}>
                <Popup>
                  <strong>{f.name}</strong><br />
                  {f.description}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
      {/* Marker Details Modal */}
      {modal.show && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Marker Details</h5>
                <button type="button" className="btn-close" onClick={() => setModal({ show: false, feature: null })}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {modal.feature?.name}</p>
                <p><strong>Description:</strong> {modal.feature?.description}</p>
                <p><strong>Latitude:</strong> {modal.feature?.lat}</p>
                <p><strong>Longitude:</strong> {modal.feature?.lng}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal({ show: false, feature: null })}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView; 