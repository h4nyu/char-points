import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";

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
      <Button variant="contained" color="primary" component="span">
        Upload
      </Button>
    </div>
  );
}
