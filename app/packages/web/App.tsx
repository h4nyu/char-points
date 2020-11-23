import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import rootStore from "./store";
import Loading from "./connectors/Loading";
import Toast from "./connectors/Toast";
const MainPage = lazy(() => import("./pages/MainPage"));
const EditChartImagePage = lazy(() => import("./pages/EditCharImagePage"));

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
            <Route path={"/edit"} component={EditChartImagePage} />
            <Route path={"/"} component={MainPage} />
          </Switch>
        </Suspense>
      </Router>
    </>
  );
}
