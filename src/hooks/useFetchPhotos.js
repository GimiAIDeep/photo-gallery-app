import { useState, useEffect } from 'react';

const useFetchPhotos = (limit = 30) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://picsum.photos/v2/list?limit=${limit}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching photos');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [limit]);

  return { photos, loading, error };
};

export default useFetchPhotos;