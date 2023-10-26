import InfoEdit from './InfoEdit';

export default function Image({ image, imageId, user }) {
  return (
    <div className="info-image-container">
      {user ? <InfoEdit imageId={imageId} /> : null}
      <img alt="" className="info-image" src={image} />
    </div>
  );
}
