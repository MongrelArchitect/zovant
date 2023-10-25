export default function Image({ image }) {
  return (
    <div className="info-image-container">
      <img alt="" className="info-image" src={image} />
    </div>
  );
}
