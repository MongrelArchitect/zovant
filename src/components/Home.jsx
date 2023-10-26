import { useState, useEffect } from 'react';

import Banner from './Banner';
import Hero from './Hero';
import Image from './Image';
import Info from './Info';
import InfoControl from './InfoControl';

export default function Home({ infoSections, user }) {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const banners = { ...infoSections.banners };
    const bannerIds = Object.keys(banners);
    const cards = { ...infoSections.cards };
    const cardIds = Object.keys(cards);
    const images = { ...infoSections.images };
    const imageIds = Object.keys(images);

    const rawInfo = [];
    bannerIds.forEach((bannerId) => {
      rawInfo.push({ ...banners[bannerId], id: bannerId, type: 'banner' });
    });
    cardIds.forEach((cardId) => {
      rawInfo.push({ ...cards[cardId], id: cardId, type: 'card' });
    });
    imageIds.forEach((imageId) => {
      rawInfo.push({ ...images[imageId], id: imageId, type: 'image' });
    });
    rawInfo.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      return 0;
    });
    setInfo(rawInfo);
  }, [infoSections]);

  return (
    <div className="home">
      <Hero />
      <div className="info">
        {user ? <InfoControl user={user} /> : null}
        {info.map((infoDetail) => {
          if (infoDetail.type === 'banner') {
            return <Banner key={infoDetail.id} content={infoDetail.content} />;
          }
          if (infoDetail.type === 'card') {
            return (
              <Info
                key={infoDetail.id}
                heading={infoDetail.heading}
                content={infoDetail.content}
                image={infoDetail.image}
              />
            );
          }
          if (infoDetail.type === 'image') {
            return (
              <Image key={infoDetail.id} image={infoDetail.image} />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
