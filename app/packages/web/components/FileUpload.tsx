import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload(props: {
  onChange?: (files: File[]) => void;
}) {
  const { onChange } = props;
  const onDrop = useCallback((acceptedFiles) => {
    onChange && onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button className="button">
        <i className="fas fa-upload"></i>
      </button>
    </div>
  );
}
