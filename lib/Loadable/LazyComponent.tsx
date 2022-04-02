import React, { LazyExoticComponent, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadComponent({
  children,
}: {
  children: React.ReactChild;
}) {
  return (
    <Suspense fallback={<CircularProgress color="inherit" />}>
      {children}
    </Suspense>
  );
}
