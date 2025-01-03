import { Chess, Color, Move, PieceSymbol } from "chess.js";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Line } from "../components/LineSelector";

// Define the type for the context value
interface ChessContextType {
  selectedLine: Line | null;
  setSelectedLine: (line: Line | null) => void;
  game: Chess;
  setGame: (game: Chess) => void;
  gameStates: string[];
  loadGameStates: (gameStates: string[]) => void;
  moves: Move[];
  loadMoves: (moves: Move[]) => void;
  positionNumber: number;
  setPositionNumber: (positionNumber: number) => void;
}

// Create the context with a default value
const ChessContext = createContext<ChessContextType | undefined>(undefined);

// Create a provider component
export const ChessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [game, setGame] = useState<Chess>(new Chess());
  const [gameStates, loadGameStates] = useState<string[]>(["start"]);
  const [moves, loadMoves] = useState<Move[]>([]);
  const [positionNumber, setPositionNumber] = useState<number>(0);

  const parsePGN = (pgn: string): void => {
    if (!game) return;

    const moves: Move[] = [];
    const fens: string[] = [];
    const lines = pgn
      .split("\n")
      .filter((line) => line && !line.startsWith("["));

    let color: Color = "w"; // Start with white's turn
    let initialFEN = game.fen(); // Get the initial FEN
    fens.push(initialFEN); // Add the starting position FEN

    for (const line of lines) {
      const moveList = line.trim().split(/\s+/); // Split by whitespace

      for (const move of moveList) {
        const isCapture = move.includes("x");
        const isPromotion = move.includes("=");
        const san = move.replace(/[+#=]/g, ""); // Remove check and promotion indicators

        // Parse the move to identify from, to, and piece
        const pieceChar = move.charAt(0);
        const piece = pieceChar as PieceSymbol; // Assuming piece is denoted by the first character

        const from = ""; // Logic to determine 'from' square based on your game state
        const to = ""; // Logic to determine 'to' square based on your game state
        const captured = isCapture ? (san.charAt(1) as PieceSymbol) : undefined; // Capture logic
        const promotion = isPromotion
          ? (move.split("=").pop() as PieceSymbol)
          : undefined; // Promotion logic

        // Create a move object and apply it to the game
        const moveObject = { from, to, piece, captured, promotion };
        game.move(moveObject); // Apply the move to the game

        const currentFEN = game.fen(); // Get the FEN after the move
        fens.push(currentFEN); // Add the new FEN to the list

        moves.push({
          color,
          from,
          to,
          piece,
          captured,
          promotion,
          flags: "", // You can add flags logic as needed
          san,
          lan: "", // Placeholder for LAN if needed
          before: initialFEN, // FEN before the move
          after: currentFEN, // FEN after the move
        });

        // Update for the next move
        initialFEN = currentFEN; // Update the last position
        color = color === "white" ? "black" : "white"; // Switch color
      }
    }
    setGame(game);
    loadGameStates(fens);
    loadMoves(moves);
    setPositionNumber(fens.length - 1);
  };

  useEffect(() => {
    if (selectedLine?.position) parsePGN(selectedLine.position);
  }, [selectedLine, setSelectedLine]);

  return (
    <ChessContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};

// Custom hook to use the ChessContext
export const useChessContext = (): ChessContextType => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ChessProvider");
  }
  return context;
};
