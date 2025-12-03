"use client";

import { IImage } from "@/types/schemas";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ImagePreviewModalProps {
  images: IImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImagePreviewModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: ImagePreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        case "+":
        case "=":
          setZoom((prev) => Math.min(prev + 0.25, 3));
          break;
        case "-":
          setZoom((prev) => Math.max(prev - 0.25, 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    if (currentImage?.url) {
      const link = document.createElement("a");
      link.href = currentImage.url;
      link.download =
        (currentImage as any).altText || `gallery-image-${currentIndex + 1}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="bg-opacity-50 hover:bg-opacity-70 absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === images.length - 1}
            className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={currentImage.url}
          alt={
            (currentImage as any).altText || `Gallery image ${currentIndex + 1}`
          }
          className="max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          draggable={false}
        />
      </div>

      {/* Controls */}
      <div className="bg-opacity-50 absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black px-4 py-2">
        <button
          onClick={handleZoomOut}
          className="hover:bg-opacity-20 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="px-2 text-sm text-white">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="hover:bg-opacity-20 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <div className="bg-opacity-30 mx-2 h-4 w-px bg-white" />
        <button
          onClick={handleDownload}
          className="hover:bg-opacity-20 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="bg-opacity-50 absolute right-4 bottom-4 z-10 rounded-full bg-black px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Image Info */}
      {(currentImage as any).altText && (
        <div className="bg-opacity-50 absolute top-4 left-4 z-10 max-w-md rounded-lg bg-black p-3 text-white">
          <p className="text-sm">{(currentImage as any).altText}</p>
        </div>
      )}
    </div>
  );
}
