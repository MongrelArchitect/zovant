export default function HeroStatic({ image }) {
  const style = {
    backgroundImage: `url("${image}")`,
  };

  return (
    <div className="hero-static" style={style} />
  );
}
