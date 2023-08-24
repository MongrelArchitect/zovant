// react hooks
import { useEffect, useState } from 'react';

// images
import cams01 from '../assets/images/cams01.jpg';
import globe01 from '../assets/images/globe01.jpg';
import lock01 from '../assets/images/lock01.jpg';

// icons
import previousIcon from '../assets/images/previous.svg';
import nextIcon from '../assets/images/next.svg';

// style
import '../styles/hero.css';

export default function Hero() {
  const images = [cams01, globe01, lock01];

  const [carouselStyle, setCarouselStyle] = useState({
    width: `calc(100vw * ${images.length})`,
  });

  const [currentImage, setCurrentImage] = useState(0);

  const [paused, setPaused] = useState(false);

  const [timeoutId, setTimeoutId] = useState(null);

  const changeImage = (index) => {
    setCurrentImage(index);
    setCarouselStyle({
      ...carouselStyle,
      transform: `translateX(-${index * 100}vw)`,
    });
  };

  const nextImage = () => {
    if (currentImage === images.length - 1) {
      setCurrentImage(0);
      changeImage(0);
    } else {
      setCurrentImage(currentImage + 1);
      changeImage(currentImage + 1);
    }
  };

  const pauseCarousel = () => {
    setPaused(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const prevImage = () => {
    if (currentImage === 0) {
      setCurrentImage(images.length - 1);
      changeImage(images.length - 1);
    } else {
      setCurrentImage(currentImage - 1);
      changeImage(currentImage - 1);
    }
  };

  useEffect(() => {
    let timeout;
    if (!paused) {
      timeout = setTimeout(nextImage, 5000);
      setTimeoutId(timeout);
    } else {
      clearTimeout(timeout);
    }
  }, [currentImage, paused]);

  return (
    <div className="hero">
      <div className="carousel" style={carouselStyle}>
        {images.map((image) => {
          const style = {
            backgroundImage: `url("${image}")`,
          };
          return (
            <div
              className="hero-image"
              // XXX
              key={`hero-image-${images.indexOf(image)}`}
              style={style}
            />
          );
        })}
      </div>

      <div className="carousel-controls">
        <button
          className="control"
          onClick={() => {
            prevImage();
            pauseCarousel();
          }}
          type="button"
        >
          <img alt="previous" src={previousIcon} />
        </button>

        {images.map((image) => (
          <button
            className={
              images.indexOf(image) === currentImage
                ? 'carousel-picker active'
                : 'carousel-picker'
            }
            // XXX
            key={`carousel-control-${images.indexOf(image)}`}
            onClick={() => {
              changeImage(images.indexOf(image));
              pauseCarousel();
            }}
            type="button"
          >
            {' '}
          </button>
        ))}

        <button
          className="control"
          onClick={() => {
            nextImage();
            pauseCarousel();
          }}
          type="button"
        >
          <img alt="next" src={nextIcon} />
        </button>
      </div>
    </div>
  );
}
