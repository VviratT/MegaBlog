import React from "react";
import Spline from "@splinetool/react-spline";
import { Loader } from "lucide-react";

const SplineBackground = () => {
  return (
    <>
      <div className="flex items-center justify-center">
        <Loader className="animate-pulse animate-spin h-5 w-5 text-deep-orange mr-2" />
        <h1 className="z-[2] animate-pulse text-deep-orange">Loading...</h1>
      </div>
      <div className="fixed inset-0 z-[-1]">
        <Spline scene="https://prod.spline.design/eNCdAItbkAzcklwq/scene.splinecode" />
      </div>
    </>
  );
};

export default SplineBackground;
