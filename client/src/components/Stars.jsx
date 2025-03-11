import React, { useEffect, useState } from 'react';

const Stars = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const numStars = 150;

      for (let i = 0; i < numStars; i++) {
        newStars.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: ['tiny', 'small', 'medium', 'large'][Math.floor(Math.random() * 4)],
          duration: `${Math.random() * 3 + 2}s`,
          delay: `${Math.random() * 3}s`
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star star--${star.size}`}
          style={{
            left: star.left,
            top: star.top,
            '--twinkle-duration': star.duration,
            animationDelay: star.delay
          }}
        />
      ))}

      {/* Update comet classes to match CSS */}
      <div className="comet comet-green" />
      <div className="comet comet-red" />
      <div className="comet comet-pink" />

      <div className="planet planet-mars" />
      <div className="planet planet-jupiter" />
      <div className="planet planet-saturn" />
      
      {/* Make sure these galaxy divs are present */}
      <div className="galaxy galaxy-1"></div>
      <div className="galaxy galaxy-2"></div>
    </div>
  );
};

export default Stars;