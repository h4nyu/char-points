import React from "react";
import Button from "@material-ui/core/Button";
import AppBar from "./AppBar";

export default function App() {
  return (
    <div>
      <AppBar />
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </div>
  );
}
