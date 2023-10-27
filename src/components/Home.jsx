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

  const showEmptyPage = () => {
    if (user) {
      return (
        <div className="flex flex-col g16 align-center">
          <h1 className="text-xl">Hi Avo!</h1>
          <p>
            There are no info cards to display. Click the buttons above to add
            some!
          </p>
          <p>BTW, nobody can see this message but you.</p>
        </div>
      );
    }
    return (
      <Info
        heading="Welcome to Zovant"
        content="Check out our products to see all that we have to offer!"
        user={user}
      />
    );
  };

  return (
    <div className="home">
      <Hero />
      <div className="info">
        {user ? <InfoControl user={user} /> : null}
        {info.length
          ? info.map((infoDetail) => {
            if (infoDetail.type === 'banner') {
              return (
                <Banner
                  bannerId={infoDetail.id}
                  content={infoDetail.content}
                  key={infoDetail.id}
                  user={user}
                />
              );
            }
            if (infoDetail.type === 'card') {
              return (
                <Info
                  content={infoDetail.content}
                  heading={infoDetail.heading}
                  image={infoDetail.image}
                  infoId={infoDetail.id}
                  key={infoDetail.id}
                  user={user}
                />
              );
            }
            if (infoDetail.type === 'image') {
              return (
                <Image
                  image={infoDetail.image}
                  imageId={infoDetail.id}
                  key={infoDetail.id}
                  user={user}
                />
              );
            }
            return null;
          })
          : showEmptyPage()}
      </div>
    </div>
  );
}
