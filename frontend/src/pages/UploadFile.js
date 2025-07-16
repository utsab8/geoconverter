import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';

const UploadFile = () => {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div>
      <h3>Upload File</h3>
      {success && <div className="alert alert-success">File uploaded successfully!</div>}
      <FileUpload onUploadSuccess={handleSuccess} />
    </div>
  );
};

export default UploadFile; 