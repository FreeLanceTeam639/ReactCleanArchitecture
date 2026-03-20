export default function NoticeBanner({ message }) {
  if (!message) {
    return null;
  }

  return <div className="notice wrap">{message}</div>;
}
