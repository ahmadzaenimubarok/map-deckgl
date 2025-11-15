import DeckMap from '../Components/DeckMap';
import AppLayout from '../Layouts/AppLayout';
import { useState } from 'react';


export default function MapPlayground() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('geojson_file', selectedFile);

    try {
      // Safely get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const headers = {
        'Accept': 'application/json',
      };
      
      // Only add CSRF token if it exists
      if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch('/import/geojson', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (response.ok) {
        // Success - reset form
        setSelectedFile(null);
        // You can add success notification here
        console.log('File imported successfully');
      } else {
        // Handle error
        console.error('Import failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout>
      {/* Fullscreen Map */}
      <div className="relative w-full h-screen">
        <DeckMap />

        {/* Overlay Panel */}
        <div className="
          absolute top-6 left-6
          bg-white shadow-xl rounded-lg p-6 
          w-80 z-50
        ">
          <h2 className="text-lg font-semibold mb-4">Import GeoJSON</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose GeoJSON File
              </label>
              <input
                type="file"
                accept=".geojson,.json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>

            {selectedFile && (
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">
                  Selected: {selectedFile.name}
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
              hover:bg-blue-700 transition-colors disabled:bg-gray-400
              disabled:cursor-not-allowed"
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}