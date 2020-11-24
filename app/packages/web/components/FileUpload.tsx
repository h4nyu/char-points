import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload(props: {
  accept?: string;
  onChange?: (files: File[]) => void;
}) {
  const { onChange, accept } = props;
  const onDrop = useCallback((acceptedFiles) => {
    onChange && onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div
      className="button is-light is-fullwidth"
      {...getRootProps()}
      style={{ height: 105 }}
    >
      <input {...getInputProps()} accept={accept} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <i className="fas fa-upload fa-3x"></i>
        Drag and drop
      </div>
    </div>
  );
}
