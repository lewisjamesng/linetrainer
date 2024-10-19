"use client";
import React, { useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function App() {
  const chess = new Chess();
  const moves = chess.moves();

  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <Chessboard id="BasicBoard" />
      </div>
    </div>
  );
}
