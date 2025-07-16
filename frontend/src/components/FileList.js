import React, { useEffect, useState } from 'react';
import API from '../services/api';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('files/list/');
      setFiles(res.data);
    } catch (err) {
      setError('Failed to fetch files.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    setDeleting(id);
    try {
      await API.delete(`files/delete/${id}/`);
      setFiles(files.filter(f => f.id !== id));
    } catch (err) {
      setError('Failed to delete file.');
    }
    setDeleting(null);
  };

  const handleDownload = (fileUrl, fileName) => {
    // Use the backend's media URL
    window.open(fileUrl, '_blank');
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (files.length === 0) return <div>No files uploaded yet.</div>;

  return (
    <div>
      <h3>My Files</h3>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td>{file.original_name}</td>
              <td>{file.file_size ? (file.file_size / 1024).toFixed(2) + ' KB' : '-'}</td>
              <td>{file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : '-'}</td>
              <td>
                <button className="btn btn-sm btn-success me-2" onClick={() => handleDownload(file.file, file.original_name)}>
                  Download
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(file.id)} disabled={deleting === file.id}>
                  {deleting === file.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList; 