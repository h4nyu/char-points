import React, { useRef, useLayoutEffect, useState } from "react";
export const PageLayout = (props: {
  header: React.ReactNode;
  content: React.ReactNode;
}) => {
  const { header, content } = props;
  const headerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    setHeight(headerRef?.current?.clientHeight || 0);
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div ref={headerRef}>{header}</div>
      <div
        style={{
          height: `calc(100vh - ${height}px)`,
        }}
      >
        {content}
      </div>
    </div>
  );
};
export default PageLayout;
