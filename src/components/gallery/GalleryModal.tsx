"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IImage, ISubCategory } from "@/types/schemas";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: IImage[];
  currentImageIndex: number;
  subCategory: ISubCategory;
  onPrevious: () => void;
  onNext: () => void;
}

export default function GalleryModal({
  isOpen,
  onClose,
  images,
  currentImageIndex,
  subCategory,
  onPrevious,
  onNext,
}: GalleryModalProps) {
  const currentImage = images[currentImageIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {subCategory.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">
              {images.length} {images.length === 1 ? "image" : "images"}
            </Badge>
            <span className="text-sm text-gray-500">
              {currentImageIndex + 1} of {images.length}
            </span>
          </div>
        </DialogHeader>

        <div className="relative px-6 pb-6">
          {currentImage && (
            <div className="relative">
              <Image
                src={currentImage.url}
                alt={(currentImage as any).altText || subCategory.name}
                width={800}
                height={600}
                className="h-auto max-h-[60vh] w-full rounded-lg object-contain"
              />

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    disabled={currentImageIndex === 0}
                    className="absolute top-1/2 left-4 h-10 w-10 -translate-y-1/2 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNext}
                    disabled={currentImageIndex === images.length - 1}
                    className="absolute top-1/2 right-4 h-10 w-10 -translate-y-1/2 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Image thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image._id}
                  onClick={() => {
                    // This would need to be handled by parent component
                    // For now, we'll just show the current image
                  }}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={(image as any).altText || subCategory.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
