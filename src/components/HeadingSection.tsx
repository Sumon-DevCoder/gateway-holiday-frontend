import React from "react";

interface HeadingSectionProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle: string;
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  badgeText,
  badgeIcon,
  title,
  subtitle,
}) => {
  return (
    <div className="mb-8 text-center sm:mb-12 lg:mb-16">
      {badgeText && (
        <div className="mb-4 inline-flex items-center rounded-full bg-orange-100 px-3 py-2 sm:mb-6 sm:px-4">
          <span className="flex items-center gap-1 text-xs font-semibold tracking-wider text-orange-600 uppercase sm:text-sm">
            {badgeIcon && <span>{badgeIcon}</span>}
            {badgeText}
          </span>
        </div>
      )}

      <h2 className="mb-3 text-2xl font-bold text-blue-600 sm:mb-4 sm:text-3xl md:text-3xl lg:text-4xl">
        {title}
      </h2>

      <p className="mx-auto max-w-2xl px-2 text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
        {subtitle}
      </p>
    </div>
  );
};

export default HeadingSection;
