import React, { LazyExoticComponent, Suspense } from 'react';

export default function LoadComponent(
  {
    LazyComponent
  }:
  {
    LazyComponent: LazyExoticComponent<any>
  }
) {
  return <Suspense fallback={<div>loading</div>}>
    <LazyComponent/>
  </Suspense>
}