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
      <i className="fas fa-angle-double-down">aaaa</i>
      <i className="fas fa-adjust"></i>
      <button className="button">Upload</button>
    </div>
  );
}
