import React from "react";
import { Header } from "../components/Header";
import { observer, useObserver } from "mobx-react-lite";
import { createContainer } from "unstated-next";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { observable, autorun } from "mobx";

const Store = () => {
  let count = 0;
  const countUp = () => {
    count = count + 1;
  };
  return {
    count,
    countUp: autorun(countUp),
  };
};
const store = observable(Store());

const useStoreA = () => {
  const [count, setCount] = React.useState(0);
  console.log("useStoreA");
  const countUp = () => {
    setCount(count + 1);
    console.log(`called ${count}`);
  };
  React.useEffect(() => {
    setInterval(() => {
      countUp();
    }, 1000);
  }, []);

  return {
    count,
    countUp,
  };
};

const useStoreB = () => {
  const [count, setCount] = React.useState(0);
  const countUp = () => {
    setCount(count + 1);
  };
  console.log("useStoreB");
  return {
    count,
    countUp,
  };
};
const StoreA = createContainer(useStoreA);
const StoreB = createContainer(useStoreB);

const AB = observer(({}) => {
  const storeA = StoreA.useContainer();
  const storeB = StoreB.useContainer();
  console.log("reander AB");
  return (
    <div>
      {storeA.count}
      <button onClick={() => storeA.countUp()}>countUp</button>
      {storeB.count}
      <button onClick={() => storeB.countUp()}>countUp</button>
      {store.count}
      <button onClick={() => store.countUp()}>store</button>
    </div>
  );
});

const B = () => {
  const storeB = StoreB.useContainer();
  console.log("reander B");
  return (
    <div>
      {storeB.count}
      <button onClick={() => storeB.countUp()}>countUp</button>
    </div>
  );
};
const A = () => {
  const storeA = StoreA.useContainer();
  console.log("reander A");
  return (
    <div>
      {storeA.count}
      <button onClick={() => storeA.countUp()}>countUp</button>
    </div>
  );
};

export default function MainPage() {
  return (
    <StoreB.Provider>
      <StoreA.Provider>
        <Header />
        <Card>
          <CardContent>
            <AB />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <A />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <B />
          </CardContent>
        </Card>
      </StoreA.Provider>
    </StoreB.Provider>
  );
}
