import "@/styles/gallery.css";
import Image from "next/image";

export interface GalleryItem {
  id: number;
  count: number;
  image: string;
  title: string;
  description: string;
  link: string;
}

export default function GalleryCard({
  image,
  title,
  description,
  link: _link,
}: Omit<GalleryItem, "id">) {
  return (
    <div className="gallery-card group relative transform overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
      {/* Image Container - Full Height with Overlay */}
      <div className="gallery-card-image relative aspect-[4/3] w-full overflow-hidden">
        <Image
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={image}
          alt={title}
          loading="lazy"
          width={400}
          height={300}
          onError={(e) => {
            // Replace with placeholder image
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
          }}
        />

        {/* Gradient Overlay - Always visible, stronger at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Title Overlay at Bottom */}
        <div className="absolute right-0 bottom-0 left-0 p-5 text-center">
          <h5 className="gallery-card-title mb-1 text-xl font-bold text-white drop-shadow-lg">
            {title}
          </h5>
          {description && (
            <p className="gallery-card-description text-sm text-white/90 drop-shadow-md">
              {description}
            </p>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
}
