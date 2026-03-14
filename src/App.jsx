import React, { useReducer, useCallback, useMemo, useState } from 'react';
import useFetchPhotos from './hooks/useFetchPhotos';

// Load favourites from localStorage
const getInitialFavourites = () => {
  try {
    const stored = localStorage.getItem('favourites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

// Reducer for favourites
const favouritesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const photoId = action.payload;
      const newState = state.includes(photoId)
        ? state.filter(id => id !== photoId)
        : [...state, photoId];
      
      localStorage.setItem('favourites', JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
};

function App() {
  const { photos, loading, error } = useFetchPhotos(30);
  const [favourites, dispatch] = useReducer(favouritesReducer, null, getInitialFavourites);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photos;
    const query = searchQuery.toLowerCase().trim();
    return photos.filter(photo => 
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchQuery]);

  const toggleFavourite = useCallback((photoId) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: photoId });
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading photos...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Photo Gallery
        </h1>
        
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by author name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">
            Found {filteredPhotos.length} photos
          </p>
        </div>
        
        {/* Photo Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`https://picsum.photos/id/${photo.id}/400/300`}
                  alt={photo.author}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{photo.author}</p>
                    <button
                      onClick={() => toggleFavourite(photo.id)}
                      className={`p-2 rounded-full focus:outline-none ${
                        favourites.includes(photo.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <svg className="h-5 w-5" fill={favourites.includes(photo.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No photos found</p>
        )}
      </div>
    </div>
  );
}

export default App;