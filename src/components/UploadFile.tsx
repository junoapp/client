import React from 'react';

export function UploadFile() {
  return (
    <div>
      <label className="label">Upload a file:</label>
      <div className="mt-2">
        <label htmlFor="file" className="button">
          Select a file
        </label>
        <input type="file" className="hide" name="file" id="file" />
      </div>
    </div>
  );
}
