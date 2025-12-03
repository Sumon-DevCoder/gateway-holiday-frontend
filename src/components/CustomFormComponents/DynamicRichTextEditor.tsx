"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import RichTextEditor with SSR disabled
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="text-editor-container">
      <div className="flex h-[300px] w-full animate-pulse items-center justify-center rounded border border-gray-300 bg-gray-100">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    </div>
  ),
});

interface DynamicRichTextEditorProps {
  name: string;
  label?: string;
  required?: boolean;
  content: string;
  onChangeHandler: (content: string) => void;
}

const DynamicRichTextEditor: React.FC<DynamicRichTextEditorProps> = (props) => {
  return <RichTextEditor {...props} />;
};

export default DynamicRichTextEditor;
