export default function Media({ src, alt = '', className = '', style = {} }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={className} style={style} />;
}
