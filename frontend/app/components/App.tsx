"use client";
import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  BoardOrientation,
  Piece,
  Square,
} from "react-chessboard/dist/chessboard/types";

export default function App() {
  const [game] = useState(new Chess());
  const [gameState, loadGameState] = useState<string | null>(null);
  const [boardOrientation, setBoardOrientation] =
    useState<BoardOrientation>("black");

  const onPieceClick: (piece: Piece, square: Square) => any = (
    piece,
    square
  ) => {
    const legalMoves = game.moves({ square });
    console.log(legalMoves);
  };

  const onDrop: (
    sourceSquare: Square,
    targetSquare: Square,
    piece: Piece
  ) => boolean = (sourceSquare, targetSquare, piece) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });
    } catch (e) {
      return false;
    }

    loadGameState(game.fen());
    return true; // valid move
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <Chessboard
          id="BasicBoard"
          onPieceClick={onPieceClick}
          onPieceDrop={onDrop}
          position={gameState ?? "start"}
          showBoardNotation={true}
          boardOrientation={boardOrientation}
        />
      </div>
    </div>
  );
}
