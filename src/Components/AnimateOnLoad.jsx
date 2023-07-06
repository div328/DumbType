import React, { useState, useEffect } from 'react';
import '../AnimateOnLoad.css'; // Import CSS styles for the animation

const AnimateOnLoad = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className={`animation-container ${isLoading ? 'loading' : ''}`}>
      {/* Content to be animated */}
      <h3>Loading ...</h3>
    </div>
  );
};

export default AnimateOnLoad;