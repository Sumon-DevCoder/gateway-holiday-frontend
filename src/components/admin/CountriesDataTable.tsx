import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ICountry } from "@/types/country";
import { Edit, GripVertical, ImageIcon, MoreVertical, Plane, Shield, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CountriesDataTableProps {
  countries: ICountry[];
  onEdit: (country: ICountry) => void;
  onDelete: (country: ICountry) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  isDeleting?: boolean;
  isReordering?: boolean;
  enableReorder?: boolean;
  getTourCount: (countryId: string) => number;
  getVisaCount: (countryName: string) => number;
}

export default function CountriesDataTable({
  countries,
  onEdit,
  onDelete,
  onReorder,
  isDeleting = false,
  isReordering = false,
  enableReorder = true,
  getTourCount,
  getVisaCount,
}: CountriesDataTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!enableReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!enableReorder) return;
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    if (!enableReorder) return;
    setDraggedIndex(null);
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Order</TableHead>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Tours</TableHead>
            <TableHead>Visas</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.map((country, index) => (
            <TableRow
              key={country._id}
              draggable={enableReorder && !isReordering}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`${
                enableReorder ? "cursor-move" : "cursor-default"
              } transition-colors ${
                draggedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <GripVertical
                    className={`h-4 w-4 ${enableReorder ? "text-gray-400" : "text-gray-200"}`}
                  />
                  <span className="text-sm font-medium text-gray-500">
                    {country.order !== undefined ? country.order : index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  {country.imageUrl ? (
                    <Image src={country.imageUrl} alt={country.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{country.name}</span>
                  {country.isTop && (
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Top Country
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {getTourCount(country._id || "")}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getTourCount(country._id || "") === 1 ? "tour" : "tours"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {getVisaCount(country.name)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getVisaCount(country.name) === 1 ? "visa" : "visas"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {country.createdAt
                  ? new Date(country.createdAt).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(country)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Country
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(country)}
                      disabled={isDeleting}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Country
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

