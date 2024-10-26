"use client";
import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move } from "chess.js";
import {
  BoardOrientation,
  Piece,
  Square,
} from "react-chessboard/dist/chessboard/types";

export default function ChessboardBlock() {
  const [game, setGame] = useState(new Chess());
  const [gameStates, loadGameStates] = useState<string[]>(["start"]);
  const [moves, loadMoves] = useState<string[]>([]);
  const [positionNumber, setPositionNumber] = useState<number>(0);

  const [boardOrientation, setBoardOrientation] =
    useState<BoardOrientation>("black");

  const onPieceClick: (piece: Piece, square: Square) => any = (
    piece,
    square
  ) => {
    const legalMoves = game.moves({ square });
  };

  function fenToBoard(fen: string): string[][] {
    const rows: string[] = fen.split(" ")[0].split("/");
    const board: string[][] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const boardRow: string[] = [];
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        if (parseInt(char)) {
          // If the character is a number, push that many empty squares
          for (let k = 0; k < parseInt(char); k++) {
            boardRow.push("."); // Use '.' to represent empty squares
          }
        } else {
          // Push the piece character (lowercase for black, uppercase for white)
          boardRow.push(char);
        }
      }
      board.push(boardRow);
    }

    return board;
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
    let move: Move;

    try {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });
    } catch (e) {
      return false;
    }

    // Clear future moves and game states if not at the latest position
    let currentGameStates = gameStates;
    if (positionNumber !== gameStates.length - 1) {
      currentGameStates = gameStates.slice(0, positionNumber);
    }

    // Update the moves and game states with the new move

    loadGameStates([...currentGameStates, game.fen()]);
    setPositionNumber(currentGameStates.length);

    return true; // valid move
  };

  const goBackwards = () => {
    if (positionNumber > 0) {
      try {
        if (positionNumber == 1) {
          setGame(new Chess());
        } else {
          game.load(gameStates[positionNumber - 1]);
        }
      } catch (e) {
        console.log(e);
      }
      setPositionNumber(positionNumber - 1);
    }
  };

  const goForwards = () => {
    if (positionNumber < gameStates.length - 1) {
      try {
        game.load(gameStates[positionNumber + 1]);
      } catch (e) {
        console.log(e);
      }
      setPositionNumber(positionNumber + 1);
    }
  };

  return (
    <div className="p-10">
      <Chessboard
        id="BasicBoard"
        onPieceClick={onPieceClick}
        onPieceDrop={onDrop}
        position={gameStates[positionNumber]}
        showBoardNotation={true}
        boardOrientation={boardOrientation}
      />
      <div className="flex justify-between m-5">
        <div>
          <button onClick={goBackwards}>Go back</button>
        </div>
        <div>
          <button onClick={goForwards}>Go forwards</button>
        </div>
      </div>
    </div>
  );
}
