export function ItemMedia({
  imageUrl,
  gradient,
  alt,
  className = "",
}: {
  imageUrl?: string | null;
  gradient: [string, string];
  alt: string;
  className?: string;
}) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded images from an arbitrary/unknown host (local dev or Vercel Blob)
    return <img src={imageUrl} alt={alt} className={`object-cover ${className}`} />;
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    />
  );
}
