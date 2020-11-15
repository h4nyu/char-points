import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import rootStore from "./store";
import Loading from "./connectors/Loading"
import Toast from "./connectors/Toast"
const MainPage = lazy(() => import("./pages/MainPage"));

export const routes = [
  {
    path: "/",
    Component: MainPage,
  },
];

export default function App() {
  React.useEffect(() => {
    rootStore.init();
  });
  return (
    <>
      <Router>
        <Loading />
        <Toast />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} component={Component} />
            ))}
          </Switch>
        </Suspense>
      </Router>
    </>
  );
}
