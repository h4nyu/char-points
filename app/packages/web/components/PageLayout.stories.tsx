import React from "react";
import PageLayout from "./PageLayout";
import Mock from "./Mock";

export default {
  title: "PageLayout",
  component: PageLayout,
};
export const Primary = () => (
  <PageLayout
    header={<Mock style={{ height: 100 }} />}
    content={
      <div style={{ height: "100%" }}>
        <div style={{ height: "100%", overflow: "scroll" }}>
          <Mock style={{ height: 1000 }} />
        </div>
      </div>
    }
  />
);
