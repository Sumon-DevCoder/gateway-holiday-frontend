"use client";
import Link from "next/link";
import React from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  backgroundImage?: string;
  pageTitle?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  backgroundImage,
  pageTitle,
}) => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage || "/default-bg.jpg"})`,
      }}
      aria-label="Breadcrumb"
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        {pageTitle && (
          <h1 className="text-2xl md:text-4xl lg:text-4xl text-white font-extrabold mb-3">
            {pageTitle}
          </h1>
        )}

        {/* Breadcrumb path */}
        <nav className="text-xl md:text-xl flex " aria-label="Breadcrumb">
          <ol className="flex item-start gap-2 text-white/90">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx !== 0 && <li className="text-white/50">›</li>}
                <li>
                  {item.href ? (
                    <Link href={item.href} className="hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <p>
                      Home /
                      <span className="font-semibold text-yellow-500 ml-1">
                        {pageTitle}
                      </span>
                    </p>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;
