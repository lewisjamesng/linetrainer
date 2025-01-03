"use client";
import React, { useState } from "react";
import { ChessProvider } from "../contexts/ChessContext";
import ChessboardBlock from "./ChessboardBlock/ChessboardBlock";
import LineSelector from "./LineSelector";

export default function App() {
  return (
    <ChessProvider>
      <div className="flex justify-between">
        <div className="w-1/4">
          <LineSelector />
        </div>
        <div className="w-3/4 me-5">
          <ChessboardBlock />
        </div>
      </div>
    </ChessProvider>
  );
}
