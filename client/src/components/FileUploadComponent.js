import React, { useState } from "react";

const FileUploadComponent = ({socket}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleSubmit = () => {
    if (file) {
      alert(`File "${file.name}" submitted successfully!`);
    } else {
      alert("Please select a file before submitting.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer w-80 mx-auto">
      {/* Drag-and-Drop Area */}
      <div
        className="flex flex-col items-center justify-center w-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="text-lg font-semibold text-gray-800">Upload your files</p>
        <p className="text-sm text-gray-500 mt-2">
          Click to upload files (files should be under 10 MB)
        </p>
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute opacity-0 w-full h-full cursor-pointer"
        />
        {file && (
          <p className="text-sm text-gray-600 mt-4">Selected file: {file.name}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Submit
      </button>
    </div>
  );
};

export default FileUploadComponent;
