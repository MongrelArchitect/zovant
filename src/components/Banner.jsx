import InfoEdit from './InfoEdit';

export default function Banner({ bannerId, content, user }) {
  return (
    <div className="banner">
      {user ? <InfoEdit bannerId={bannerId} /> : null}
      <h2>{content}</h2>
    </div>
  );
}
