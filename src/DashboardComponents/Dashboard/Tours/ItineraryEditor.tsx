"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface MealData {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface ItineraryBlock {
  type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
  title?: string;
  subtitle?: string;
  description?: string;
  meals?: MealData;
  hotelName?: string;
  timeFrom?: string;
  timeTo?: string;
}

interface ItineraryDay {
  dayNo: number;
  title: string;
  blocks: ItineraryBlock[];
}

interface ItineraryEditorProps {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
}

const blockTypeOptions = [
  { label: "Transfer", value: "TRANSFER" },
  { label: "Sightseeing", value: "SIGHTSEEING" },
  { label: "Meal", value: "MEAL" },
  { label: "Hotel", value: "HOTEL" },
  { label: "Note", value: "NOTE" },
];

export default function ItineraryEditor({
  itinerary,
  onChange,
}: ItineraryEditorProps): React.ReactElement {
  const addDay = () => {
    const newDay: ItineraryDay = {
      dayNo: itinerary.length + 1,
      title: "",
      blocks: [],
    };
    onChange([...itinerary, newDay]);
  };

  const removeDay = (index: number) => {
    const updatedItinerary = itinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumberedItinerary = updatedItinerary.map((day, i) => ({
      ...day,
      dayNo: i + 1,
    }));
    onChange(renumberedItinerary);
  };

  const updateDayTitle = (index: number, title: string) => {
    const updatedItinerary = itinerary.map((day, i) =>
      i === index ? { ...day, title } : day
    );
    onChange(updatedItinerary);
  };

  const addBlock = (dayIndex: number) => {
    const updatedItinerary = itinerary.map((day, i) => {
      if (i === dayIndex) {
        const newBlock: ItineraryBlock = {
          type: "SIGHTSEEING",
          title: "",
          subtitle: "",
          description: "",
          timeFrom: "",
          timeTo: "",
        };
        return {
          ...day,
          blocks: [...day.blocks, newBlock],
        };
      }
      return day;
    });
    onChange(updatedItinerary);
  };

  const removeBlock = (dayIndex: number, blockIndex: number) => {
    const updatedItinerary = itinerary.map((day, i) => {
      if (i === dayIndex) {
        return {
          ...day,
          blocks: day.blocks.filter((_, bi) => bi !== blockIndex),
        };
      }
      return day;
    });
    onChange(updatedItinerary);
  };

  const updateBlock = (
    dayIndex: number,
    blockIndex: number,
    field: keyof ItineraryBlock,
    value: any
  ) => {
    const updatedItinerary = itinerary.map((day, di) => {
      if (di === dayIndex) {
        return {
          ...day,
          blocks: day.blocks.map((block, bi) => {
            if (bi === blockIndex) {
              return {
                ...block,
                [field]: value,
              };
            }
            return block;
          }),
        };
      }
      return day;
    });
    onChange(updatedItinerary);
  };

  const updateBlockMeal = (
    dayIndex: number,
    blockIndex: number,
    mealType: "breakfast" | "lunch" | "dinner",
    checked: boolean
  ) => {
    const updatedItinerary = itinerary.map((day, di) => {
      if (di === dayIndex) {
        return {
          ...day,
          blocks: day.blocks.map((block, bi) => {
            if (bi === blockIndex) {
              return {
                ...block,
                meals: {
                  breakfast: block.meals?.breakfast || false,
                  lunch: block.meals?.lunch || false,
                  dinner: block.meals?.dinner || false,
                  [mealType]: checked,
                },
              };
            }
            return block;
          }),
        };
      }
      return day;
    });
    onChange(updatedItinerary);
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Itinerary (Optional)</h3>
        <Button type="button" onClick={addDay} variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add Day
        </Button>
      </div>

      {itinerary.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No itinerary added yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Click "Add Day" to start building your tour itinerary
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {itinerary.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
            >
              {/* Day Header */}
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-blue-600">
                  Day {day.dayNo}
                </h4>
                <Button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Day
                </Button>
              </div>

              {/* Day Title */}
              <div className="mb-4">
                <Label htmlFor={`day-${dayIndex}-title`}>
                  Day Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`day-${dayIndex}-title`}
                  value={day.title}
                  onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
                  placeholder="e.g., Pick up from Airport & Transfer to Hotel"
                  required
                />
              </div>

              {/* Blocks/Activities */}
              <div className="space-y-4">
                <h5 className="font-medium">Activities</h5>
                {day.blocks.map((block, blockIndex) => (
                  <div
                    key={blockIndex}
                    className="grid grid-cols-1 gap-3 rounded border border-gray-200 bg-gray-50 p-3 md:grid-cols-2"
                  >
                    {/* Block Type */}
                    <div>
                      <Label htmlFor={`block-${dayIndex}-${blockIndex}-type`}>
                        Type
                      </Label>
                      <select
                        id={`block-${dayIndex}-${blockIndex}-type`}
                        value={block.type}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "type",
                            e.target.value as any
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        {blockTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <Label htmlFor={`block-${dayIndex}-${blockIndex}-title`}>
                        Title
                      </Label>
                      <Input
                        id={`block-${dayIndex}-${blockIndex}-title`}
                        value={block.title || ""}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Tonle Sap"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <Label
                        htmlFor={`block-${dayIndex}-${blockIndex}-subtitle`}
                      >
                        Subtitle
                      </Label>
                      <Input
                        id={`block-${dayIndex}-${blockIndex}-subtitle`}
                        value={block.subtitle || ""}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "subtitle",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Pick & Drop"
                      />
                    </div>

                    {/* Time From */}
                    <div>
                      <Label
                        htmlFor={`block-${dayIndex}-${blockIndex}-timeFrom`}
                      >
                        Time From
                      </Label>
                      <Input
                        id={`block-${dayIndex}-${blockIndex}-timeFrom`}
                        type="time"
                        value={block.timeFrom || ""}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "timeFrom",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Time To */}
                    <div>
                      <Label htmlFor={`block-${dayIndex}-${blockIndex}-timeTo`}>
                        Time To
                      </Label>
                      <Input
                        id={`block-${dayIndex}-${blockIndex}-timeTo`}
                        type="time"
                        value={block.timeTo || ""}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "timeTo",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Hotel Name */}
                    <div>
                      <Label
                        htmlFor={`block-${dayIndex}-${blockIndex}-hotelName`}
                      >
                        Hotel Name
                      </Label>
                      <Input
                        id={`block-${dayIndex}-${blockIndex}-hotelName`}
                        value={block.hotelName || ""}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "hotelName",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Grand Hotel"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-1 md:col-span-2">
                      <Label
                        htmlFor={`block-${dayIndex}-${blockIndex}-description`}
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`block-${dayIndex}-${blockIndex}-description`}
                        value={block.description || ""}
                        onChange={(e) =>
                          updateBlock(
                            dayIndex,
                            blockIndex,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Detailed description of the activity"
                        rows={3}
                      />
                    </div>

                    {/* Meals (only for MEAL type) */}
                    {block.type === "MEAL" && (
                      <div className="col-span-1 md:col-span-2">
                        <Label className="mb-2 block">Meals Included</Label>
                        <div className="flex space-x-4">
                          {["breakfast", "lunch", "dinner"].map((meal) => (
                            <label
                              key={meal}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  block.meals?.[meal as keyof MealData] || false
                                }
                                onChange={(e) =>
                                  updateBlockMeal(
                                    dayIndex,
                                    blockIndex,
                                    meal as "breakfast" | "lunch" | "dinner",
                                    e.target.checked
                                  )
                                }
                                className="rounded"
                              />
                              <span className="text-sm capitalize">{meal}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remove Block Button */}
                    <div className="col-span-1 flex justify-end md:col-span-2">
                      <Button
                        type="button"
                        onClick={() => removeBlock(dayIndex, blockIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Remove Activity
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Block Button */}
                <Button
                  type="button"
                  onClick={() => addBlock(dayIndex)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Activity
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
