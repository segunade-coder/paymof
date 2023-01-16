import React from "react";
import "./loader.css";
import { ThreeDots, Vortex, Triangle } from "react-loader-spinner";
const Loader = () => {
  return (
    <div className="loader-btn">
      <Vortex
        height="25"
        width="25"
        radius="9"
        color="orangered"
        ariaLabel="loading"
      />
    </div>
  );
};

const BigLoader = () => {
  return (
    <div className="big-loader-container">
      <ThreeDots
        height="150"
        width="150"
        radius="9"
        color="orangered"
        ariaLabel="loading"
      />
      <br />
    </div>
  );
};
const AudioLoader = () => {
  return (
    <div className="big-loader-container">
      <Triangle
        height="50"
        width="50"
        radius="9"
        color="orangered"
        ariaLabel="loading"
      />
    </div>
  );
};

const loaders = {
  Loader,
  BigLoader,
  AudioLoader,
};
export default loaders;
