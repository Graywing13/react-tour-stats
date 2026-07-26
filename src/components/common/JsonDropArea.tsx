import { useCallback, useEffect, useRef, useState } from "react";

interface JsonDropAreaProps {
  onDrop: (files: FileList) => void;
}

export default function JsonDropArea(props: JsonDropAreaProps) {
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); // opening file
    e.stopPropagation();
    if (e.dataTransfer?.files?.length) {
      props.onDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleDrag = useCallback((e: DragEvent, isDragEnter: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggedOver(isDragEnter);
  }, []);

  useEffect(() => {
    let zone = dropRef.current;
    if (zone) {
      const handleDragIn = (e: DragEvent) => handleDrag(e, true);
      const handleDragOut = (e: DragEvent) => handleDrag(e, false);
      zone.addEventListener("dragenter", handleDragIn);
      zone.addEventListener("dragleave", handleDragOut);
      zone.addEventListener("drop", handleDrop);
      return () => {
        zone.removeEventListener("dragenter", handleDragIn);
        zone.removeEventListener("dragleave", handleDragOut);
        zone.removeEventListener("drop", handleDrop);
      };
    }
  }, [handleDrag, handleDrop]);

  return (
    <div
      ref={dropRef}
      className={"border-4 border-dashed border-gray-300 h-full w-full"}
    >
      {isDraggedOver ? "drag json files here" : "drop files"}
    </div>
  );
}
