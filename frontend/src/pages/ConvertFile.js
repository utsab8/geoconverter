import React, { useRef, useState } from 'react';
import API from '../services/api';
import MapView from '../components/MapView';

function parseCSV(text) {
  const lines = text.split('\n').filter(Boolean);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

const ConvertFile = () => {
  const [file, setFile] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setConvertedUrl(null);
      setFeatures([]);
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setConvertedUrl(null);
    setFeatures([]);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('files/convert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      // Create a download URL
      const url = window.URL.createObjectURL(res.data);
      setConvertedUrl(url);
      // If CSV, parse and show on map
      if (file.name.toLowerCase().endsWith('.kml')) {
        // The result is CSV, parse for map
        const text = await res.data.text();
        const rows = parseCSV(text);
        const feats = rows.map(r => ({
          lat: parseFloat(r.Latitude),
          lng: parseFloat(r.Longitude),
          name: r.Name,
          description: r.Description,
        })).filter(f => !isNaN(f.lat) && !isNaN(f.lng));
        setFeatures(feats);
      }
      // If CSV uploaded, don't parse KML for map (optional: parse KML to show points)
    } catch (err) {
      setError('Conversion failed. Please check your file.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Convert File</h3>
      <input
        type="file"
        ref={inputRef}
        accept=".kml,.csv"
        onChange={handleChange}
        className="form-control mb-2"
      />
      <button className="btn btn-primary mb-3" onClick={handleConvert} disabled={!file || loading}>
        {loading ? 'Converting...' : 'Convert'}
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {convertedUrl && (
        <div className="mb-3">
          <a href={convertedUrl} download={`converted.${file.name.endsWith('.kml') ? 'csv' : 'kml'}`} className="btn btn-success">
            Download Converted File
          </a>
        </div>
      )}
      {features.length > 0 && (
        <div className="mb-3">
          <h5>Converted Data on Map</h5>
          <MapView features={features} />
        </div>
      )}
    </div>
  );
};

export default ConvertFile; 