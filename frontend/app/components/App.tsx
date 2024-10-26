"use client";
import React, { useState } from "react";
import ChessboardBlock from "./ChessboardBlock";

export default function App() {
  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <ChessboardBlock />
      </div>
    </div>
  );
}
