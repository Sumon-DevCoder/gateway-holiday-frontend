"use client";

import GalleryCard, {
  GalleryItem,
} from "@/components/home/sections/GalleryCard";
import {
  useGetActiveCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetPublicImagesQuery,
  useGetSubCategoriesByCategoryQuery,
} from "@/redux/api/features/gallery/publicGalleryApi";
import "@/styles/gallery.css";
import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  ArrowLeft,
  FolderOpen,
  Grid3X3,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type ViewState = "categories" | "subcategories" | "images";

export default function GalleryPage() {
  const [currentView, setCurrentView] = useState<ViewState>("categories");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<ISubCategory | null>(null);
  const [isGeneralView, setIsGeneralView] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // API hooks
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetActiveCategoriesQuery();
  const { data: allSubCategoriesData } = useGetAllSubCategoriesQuery({}); // Get all subcategories for counting
  const { data: subCategoriesData, isLoading: subCategoriesLoading } =
    useGetSubCategoriesByCategoryQuery(selectedCategory?._id || "", {
      skip: !selectedCategory?._id, // Skip if no category selected
    });
  const { data: categoryImagesData, isLoading: categoryImagesLoading } =
    useGetPublicImagesQuery(
      selectedCategory?._id ? { categoryId: selectedCategory._id } : skipToken
    );

  // Extract data from API responses
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];
  const allSubCategories = Array.isArray(allSubCategoriesData?.data)
    ? allSubCategoriesData.data
    : [];
  const subCategories = Array.isArray(subCategoriesData?.data)
    ? subCategoriesData.data
    : [];
  const categoryImages = Array.isArray(categoryImagesData?.data)
    ? categoryImagesData.data
    : [];
  const generalImages = categoryImages.filter(
    (img) =>
      !img.subCategoryId ||
      img.subCategoryId.trim() === "" ||
      img.subCategoryId === "null"
  );
  const currentImages =
    currentView === "images"
      ? isGeneralView
        ? generalImages
        : categoryImages.filter(
            (image) => image.subCategoryId === selectedSubCategory?._id
          )
      : [];

  // Handle category click
  const handleCategoryClick = (category: ICategory) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setIsGeneralView(false);
    setCurrentView("subcategories");
  };

  // Handle subcategory click
  const handleSubCategoryClick = (subCategory: ISubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsGeneralView(false);
    setCurrentView("images");
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === "images") {
      setCurrentView("subcategories");
      setSelectedSubCategory(null);
      setIsGeneralView(false);
    } else if (currentView === "subcategories") {
      setCurrentView("categories");
      setSelectedCategory(null);
      setIsGeneralView(false);
    }
  };

  // Handle image click to open lightbox
  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Convert categories to gallery items
  const categoryItems: GalleryItem[] = categories.map((category: ICategory) => {
    // Count subcategories for this category using allSubCategories
    const subCategoryCount = allSubCategories.filter(
      (sub: ISubCategory) => sub.categoryId === category._id
    ).length;

    return {
      id: parseInt(category._id?.slice(-6) || "0", 16) || Math.random(),
      count: subCategoryCount,
      image:
        category.image ||
        "https://tailwindflex.com/public/images/thumbnails/coming-soon-page/thumb_u.min.webp",
      title: category.name,
      description: "",
      link: "#",
    };
  });

  // Convert subcategories to gallery items
  const subCategoryItems: GalleryItem[] = subCategories.map(
    (subCategory: ISubCategory) => {
      const imageCount = categoryImages.filter(
        (image: IImage) => image.subCategoryId === subCategory._id
      ).length;
      return {
        id: parseInt(subCategory._id?.slice(-6) || "0", 16) || Math.random(),
        count: imageCount,
        image:
          subCategory.image ||
          "https://tailwindflex.com/public/images/thumbnails/coming-soon-page/thumb_u.min.webp",
        title: subCategory.name,
        description:
          imageCount > 0
            ? `${imageCount} ${imageCount === 1 ? "photo" : "photos"}`
            : "No photos yet",
        link: "#",
      };
    }
  );

  if (generalImages.length > 0) {
    subCategoryItems.unshift({
      id: Number.MAX_SAFE_INTEGER,
      count: generalImages.length,
      image:
        generalImages[0]?.url ||
        "https://tailwindflex.com/public/images/thumbnails/coming-soon-page/thumb_u.min.webp",
      title: "General Photos",
      description: `${generalImages.length} ${
        generalImages.length === 1 ? "photo" : "photos"
      }`,
      link: "general",
    });
  }

  // Convert images to gallery items
  const imageItems: GalleryItem[] = currentImages.map((image: IImage) => ({
    id: parseInt(image._id?.slice(-6) || "0", 16) || Math.random(),
    count: 1,
    image: image.url,
    title: "Gallery Image",
    description: "Click to view full size",
    link: "#",
  }));

  // Get current items based on view
  const getCurrentItems = (): GalleryItem[] => {
    switch (currentView) {
      case "categories":
        return categoryItems;
      case "subcategories":
        return subCategoryItems;
      case "images":
        return imageItems;
      default:
        return [];
    }
  };

  if (categoriesLoading) {
    return (
      <div className="my-8 flex h-full w-full items-center justify-center p-2 sm:my-12 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Loading Gallery
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we load the gallery categories...
          </p>
        </div>
      </div>
    );
  }

  const currentItems = getCurrentItems();

  // Determine grid class based on number of items
  const getGridClass = () => {
    const itemCount = currentItems.length;
    // Use center alignment for 3 or fewer items
    return itemCount <= 3 ? "gallery-grid-center" : "gallery-grid";
  };

  return (
    <div className="my-4 flex h-full w-full items-center justify-center dark:bg-gray-800">
      <div className="container mx-auto w-full px-4">
        {/* Header with navigation */}
        <div className="mb-4 space-y-2">
          {/* Main Header */}
          <div className="flex items-center gap-4">
            {currentView !== "categories" && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
          </div>
        </div>

        {/* Loading state for subcategories and images */}
        {(currentView === "subcategories" &&
          (subCategoriesLoading || categoryImagesLoading)) ||
        (currentView === "images" && categoryImagesLoading) ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {currentView === "subcategories"
                  ? "Loading subcategories..."
                  : "Loading images..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            {currentView === "categories" && currentItems.length > 0 && (
              <div className={`${getGridClass()} p-4`}>
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const category = categories.find(
                        (cat: ICategory) => cat.name === item.title
                      );
                      if (category) {
                        handleCategoryClick(category);
                      }
                    }}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <GalleryCard {...item} />
                  </div>
                ))}
              </div>
            )}

            {/* Subcategories Grid */}
            {currentView === "subcategories" && (
              <>
                {subCategories.length > 0 ? (
                  <div className={`${getGridClass()} p-4`}>
                    {currentItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.link === "general") {
                            setIsGeneralView(true);
                            setSelectedSubCategory(null);
                            setCurrentView("images");
                            return;
                          }
                          const subCategory = subCategories.find(
                            (sub: ISubCategory) => sub.name === item.title
                          );
                          if (subCategory) handleSubCategoryClick(subCategory);
                        }}
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        <GalleryCard {...item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {categoryImages.map((image: IImage, index: number) => (
                      <div
                        key={image._id}
                        onClick={() => {
                          setIsGeneralView(true);
                          setSelectedSubCategory(null);
                          handleImageClick(index);
                          setCurrentView("images");
                        }}
                        className="aspect-3/4 cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all hover:shadow-xl"
                      >
                        <Image
                          src={image.url}
                          alt={
                            (image as any).altText ||
                            `Gallery image ${index + 1}`
                          }
                          width={400}
                          height={500}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Images Gallery Grid */}
            {currentView === "images" && currentImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {currentImages.map((image: IImage, index: number) => (
                  <div
                    key={image._id}
                    onClick={() => handleImageClick(index)}
                    className="aspect-3/4 cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all hover:shadow-xl"
                  >
                    <Image
                      src={image.url}
                      alt={
                        (image as any).altText || `Gallery image ${index + 1}`
                      }
                      width={400}
                      height={500}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state when no items */}
            {((currentView === "categories" && currentItems.length === 0) ||
              (currentView === "subcategories" && currentItems.length === 0) ||
              (currentView === "images" && currentImages.length === 0)) && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  {currentView === "categories" && (
                    <FolderOpen className="h-8 w-8 text-gray-400" />
                  )}
                  {currentView === "subcategories" && (
                    <Grid3X3 className="h-8 w-8 text-gray-400" />
                  )}
                  {currentView === "images" && (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {currentView === "categories"
                    ? "No Categories Available"
                    : currentView === "subcategories"
                      ? "No Photos Found"
                      : "No Images Found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {currentView === "categories"
                    ? "Gallery categories will appear here once they are added by administrators."
                    : currentView === "subcategories"
                      ? `No photos are available under "${selectedCategory?.name}".`
                      : `No photos are available in "${selectedSubCategory?.name}".`}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox for full image view */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentImages.map((image: IImage) => ({
          src: image.url,
          alt: (image as any).altText || "Gallery image",
        }))}
      />
    </div>
  );
}
