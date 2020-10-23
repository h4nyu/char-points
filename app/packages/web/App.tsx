import React from "react";
import Button from "@material-ui/core/Button";
import { Header } from "./Header";

export default function App() {
  return (
    <div>
      <Header />
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </div>
  );
}
