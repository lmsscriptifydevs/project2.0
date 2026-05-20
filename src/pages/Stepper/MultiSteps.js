import { lazy, memo, Suspense } from "react";
import "../../style/multistep.scss";

// Lazy load heavy components
const Navbar = lazy(() => import("../../components/Navbar"));
const MultiStep = lazy(() => import("../../components/Stepper/MultiStep"));

const MultiSteps = () => {
  return (
    <>
      {/* Suspense ensures fallback UI while components are loading */}
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar FirstNav="none" />
        <div style={{ backgroundColor: '#020617', minHeight: '100vh' }}>
          <MultiStep />
        </div>
      </Suspense>
    </>
  );
};

// Prevent unnecessary re-renders (if props don’t change)
export default memo(MultiSteps);
