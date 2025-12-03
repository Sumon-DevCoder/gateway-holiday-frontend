import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps): ReactNode {
  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold lg:text-3xl">
              {title}
            </h1>
            <div className="my-1">
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            {children && <div className="flex-shrink-0">{children}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
