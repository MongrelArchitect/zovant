export default function InfoControl({ user }) {
  if (!user) {
    return null;
  }
  return (
    <div className="flex g16">
      <button type="button">+ NEW CARD</button>
      <button type="button">+ NEW IMAGE</button>
      <button type="button">+ NEW BANNER</button>
    </div>
  );
}
