import React, { useRef, useState } from 'react';
import API from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const validExtensions = ['.kml', '.csv'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError('Only KML and CSV files are allowed.');
      setFile(null);
    } else {
      setError('');
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await API.post('files/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      setUploading(false);
      setFile(null);
      setProgress(0);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        className={`border rounded p-4 text-center mb-3 ${dragActive ? 'bg-light' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ cursor: 'pointer' }}
        onClick={() => inputRef.current.click()}
      >
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          accept=".kml,.csv"
          onChange={handleChange}
        />
        {file ? (
          <div>
            <strong>Selected file:</strong> {file.name}
          </div>
        ) : (
          <div>
            <strong>Drag & drop a KML or CSV file here, or click to select</strong>
          </div>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {uploading && (
        <div className="mb-2">
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
      )}
      <button
        className="btn btn-primary w-100"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload; 