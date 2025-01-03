"use client";
import styles from "./ChessboardBlock.module.css";
import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {
  BoardOrientation,
  Piece,
  Square,
} from "react-chessboard/dist/chessboard/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { useChessContext } from "@/app/contexts/ChessContext";

export default function ChessboardBlock() {
  const {
    selectedLine,
    setSelectedLine,
    game,
    setGame,
    gameStates,
    loadGameStates,
    moves,
    loadMoves,
    positionNumber,
    setPositionNumber,
  } = useChessContext();

  useEffect(() => {
    if (selectedLine) {
      try {
        game.loadPgn(selectedLine.position);
        setGame(game);
        loadGameStates([selectedLine.position]);
        setPositionNumber(0);
        loadMoves([]);
      } catch (e) {
        console.log(e);
      }
    }
  }, [selectedLine, setSelectedLine]);

  const [boardOrientation, setBoardOrientation] =
    useState<BoardOrientation>("black");

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
    let currentMoves = moves;
    if (positionNumber !== gameStates.length - 1) {
      currentGameStates = gameStates.slice(0, positionNumber + 1);
      currentMoves =
        positionNumber == 0 ? [] : currentMoves.slice(0, positionNumber);
    }

    // Update the moves and game states with the new move

    loadGameStates([...currentGameStates, game.fen()]);
    loadMoves([...currentMoves, move]);
    setPositionNumber(currentGameStates.length);
    console.log(game.fen());
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
    <div className={`${styles.boardContainer} p-5 my-10`}>
      <div className="flex justify-between">
        <div className="w-2/3">
          <Chessboard
            id="BasicBoard"
            onPieceDrop={onDrop}
            position={gameStates[positionNumber]}
            showBoardNotation={true}
            boardOrientation={boardOrientation}
            customLightSquareStyle={{ "background-color": "#eee" }}
            customDarkSquareStyle={{ "background-color": "#bccbb4" }}
          />
        </div>
        <div
          className={
            "w-1/3 flex flex-col justify-between " + styles.movesSection
          }
        >
          <div className="flex justify-between">
            <div className="grid grid-cols-1 w-10 place-content-baseline">
              {moves.map(
                (_, index) =>
                  index % 2 == 0 && (
                    <div
                      key={index}
                      className={styles.tableCell + " text-center"}
                    >
                      <p>{index / 2 + 1}</p>{" "}
                    </div>
                  )
              )}
            </div>
            <div className="grid grid-cols-2 w-3/4 place-content-baseline">
              {moves.map((move, index) => (
                <div
                  onClick={() => {
                    setPositionNumber(index + 1);
                  }}
                  key={index}
                  className={`text-center ${
                    index == positionNumber - 1
                      ? styles.highlighted
                      : styles.tableCell
                  }`}
                >
                  <p>{move.san}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`flex justify-between m-5 mx-10 me-4`}>
            <div>
              <button
                onClick={goBackwards}
                disabled={positionNumber == 0}
                className={styles.moveButton}
              >
                <FontAwesomeIcon icon={faBackwardStep} />
              </button>
            </div>
            <div>
              <button
                onClick={goForwards}
                disabled={positionNumber == gameStates.length - 1}
                className={styles.moveButton}
              >
                <FontAwesomeIcon icon={faForwardStep} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
