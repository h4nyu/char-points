import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

export const routes = [
  {
    path: "/",
    Component: MainPage,
  },
];

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} component={Component} />
          ))}
        </Switch>
      </Suspense>
    </Router>
  );
}
