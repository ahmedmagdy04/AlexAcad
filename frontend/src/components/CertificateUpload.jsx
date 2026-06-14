import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';
import api from '../api/api';
import '../styles/CertificateUpload.css';

export default function CertificateUpload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);   // extracted info from backend
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setProgress(0);
    setResult(null);
    setError('');
    setSuccess(false);
  };

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10 MB.');
      return;
    }
    setError('');
    setFile(f);
    setResult(null);
    setSuccess(false);
  };

  const handleInputChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError('');
    setResult(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const { data } = await api.post('/documents/certificate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / (evt.total || 1));
          setProgress(pct);
        },
      });
      setSuccess(true);
      setResult(data.transcriptData);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cert-upload">
      <div className="cert-upload__header">
        <FileText size={20} />
        <h3 className="cert-upload__title">Certificate Upload</h3>
      </div>
      <p className="cert-upload__sub">
        Upload your PDF certificate for processing and verification.
      </p>

      {/* Drop Zone */}
      {!success && (
        <div
          className={`cert-dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
          {file ? (
            <div className="cert-dropzone__file">
              <FileText size={28} />
              <div className="cert-dropzone__file-info">
                <p className="cert-dropzone__file-name">{file.name}</p>
                <p className="cert-dropzone__file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                className="cert-dropzone__remove"
                onClick={(e) => { e.stopPropagation(); reset(); }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={32} className="cert-dropzone__icon" />
              <p className="cert-dropzone__text">
                Drag &amp; drop your PDF here, or <span>click to browse</span>
              </p>
              <p className="cert-dropzone__hint">PDF only · Max 10 MB</p>
            </>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="cert-progress">
          <div className="cert-progress__bar">
            <div className="cert-progress__fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="cert-progress__label">{progress}%</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="cert-alert cert-alert--error">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="cert-success">
          <div className="cert-success__icon">
            <CheckCircle size={32} />
          </div>
          <h4 className="cert-success__title">Certificate Uploaded!</h4>
          <p className="cert-success__sub">Your certificate has been processed successfully.</p>

          {result && (
            <div className="cert-extracted">
              <p className="cert-extracted__label">Extracted Information</p>

              <div className="cert-extracted__row">
                <span className="cert-extracted__key">CGPA</span>
                <span className="cert-extracted__val">{result.cgpa}</span>
              </div>

              <div className="cert-extracted__row">
                <span className="cert-extracted__key">Completed Courses</span>
                <span className="cert-extracted__val">
                  {result.completedCourses?.length}
                </span>
              </div>

              <div className="cert-extracted__row">
                <span className="cert-extracted__key">Failed Courses</span>
                <span className="cert-extracted__val">
                  {result.failedCourses?.length}
                </span>
              </div>
            </div>
          )}

          <button className="cert-reset-btn" onClick={reset}>
            Upload Another
          </button>
        </div>
      )}

      {/* Upload Button */}
      {!success && file && (
        <button
          className="cert-upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <Loader size={16} className="spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </button>
      )}
    </div>
  );
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}
