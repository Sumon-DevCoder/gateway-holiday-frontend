/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CloudUpload } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface CustomFileUploaderProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  multiple?: boolean;
  accept?: Accept;
  className?: string;
  required?: boolean; // Added missing required prop
  existingImages?: string | string[] | undefined; // For showing existing images
}

const CustomFileUploader = <T extends FieldValues>({
  name,
  label,
  multiple = false,
  accept = {
    "image/*": [],
  },
  className,
  required = false, // Added required with default value
  existingImages,
}: CustomFileUploaderProps<T>): React.ReactElement => {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<T>();
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]): void => {
    setFiles(
      multiple ? acceptedFiles : acceptedFiles[0] ? [acceptedFiles[0]] : []
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
  });

  // Initialize existing images
  useEffect(() => {
    if (existingImages) {
      const imageArray = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
      const filteredImages = imageArray.filter(
        (img) => img && img.trim() !== ""
      );
      setExistingImageUrls(filteredImages);

      // For single file upload, set the form value
      if (!multiple && filteredImages.length > 0) {
        setValue(name, filteredImages[0] as any, { shouldValidate: false });
      }
    } else {
      setExistingImageUrls([]);
    }
  }, [existingImages, name, setValue, multiple]);

  // 🔄 Sync selected files with react-hook-form
  useEffect(() => {
    if (files.length > 0) {
      // For multiple files, combine existing images with new files
      if (multiple) {
        const combinedValue = [...existingImageUrls, ...files];
        setValue(name, combinedValue as any);
      } else {
        setValue(name, files[0] as any, { shouldValidate: true });
      }
      // Trigger validation to clear the "required" error
      trigger(name);
      const previews = files.map((file) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
      );
      setFilePreviews(previews);
    } else {
      // For multiple files, keep existing images if no new files
      if (multiple) {
        setValue(
          name,
          existingImageUrls.length > 0 ? (existingImageUrls as any) : []
        );
      } else {
        setValue(name, null as any, { shouldValidate: true });
      }
      // Trigger validation to show the "required" error if field is required
      trigger(name);
      setFilePreviews([]);
    }

    // Cleanup previews on unmount
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, name, setValue, multiple, trigger]);

  const removeFiles = (): void => {
    filePreviews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setFilePreviews([]);

    // Update form value properly
    if (multiple) {
      // For multiple files, keep existing images
      setValue(
        name,
        existingImageUrls.length > 0 ? (existingImageUrls as any) : [],
        { shouldValidate: false }
      );
    } else {
      // For single file, set to empty (don't keep existing image URL)
      setValue(name, null as any, { shouldValidate: false });
    }
    trigger(name);
  };

  const removeFile = (index: number): void => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);

    // Revoke the URL of the removed file
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index]);
    }

    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);

    // Update form value - combine existing images with remaining files
    if (multiple) {
      const combinedValue = [...existingImageUrls, ...updatedFiles];
      setValue(name, combinedValue as any);
    } else {
      setValue(name, updatedFiles[0] || (null as any));
    }
    trigger(name);
  };

  const removeExistingImage = (index: number): void => {
    const updatedImages = existingImageUrls.filter((_, i) => i !== index);
    setExistingImageUrls(updatedImages);

    // Update form value properly
    if (multiple) {
      // For multiple files, combine remaining existing images with new files
      const combinedValue = [...updatedImages, ...files];
      setValue(name, combinedValue as any, { shouldValidate: false });
    } else {
      // For single file, set to null or empty string if no images left
      setValue(name, updatedImages[0] || (null as any), {
        shouldValidate: false,
      });
    }
    trigger(name);
  };

  return (
    <div className={`mb-4 ${className || ""}`}>
      {label && <p className="mb-2 text-lg font-medium">{label}</p>}

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-md border border-dashed border-gray-400 p-6 text-center transition ${
          isDragActive ? "bg-blue-100" : "bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <CloudUpload className="mx-auto size-10 text-gray-600" />
        <p>
          {isDragActive
            ? "Drop the files here ..."
            : "Click or drag & drop files here"}
        </p>
        <em className="text-sm text-gray-500">
          (Supports image, pdf, video, audio)
        </em>
      </div>

      {/* Existing Images */}
      {existingImageUrls.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-600">
            Current Images:
          </p>
          <div className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
            {existingImageUrls.map((imageUrl, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={imageUrl}
                  alt={`existing-${idx}`}
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(files.length > 0 || filePreviews.length > 0) && (
        <div className="mt-4">
          <div className="mb-2 grid grid-cols-1 items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file, idx) => {
              const preview = filePreviews[idx];
              return file.type.startsWith("image/") && preview ? (
                <div key={idx} className="relative">
                  <Image
                    src={preview}
                    alt={`preview-${idx}`}
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  key={idx}
                  className="relative rounded border bg-gray-100 p-2 text-sm"
                >
                  📄 {file.name}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={removeFiles}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
          >
            Remove File{multiple && "s"}
          </button>
        </div>
      )}

      {/* Optional: show validation error */}
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "This field is required" : false }} // Added validation rule for required
        render={() => <></>} // Return a valid element
      />
      {errors[name] && (
        <p className="mt-2 text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomFileUploader;
