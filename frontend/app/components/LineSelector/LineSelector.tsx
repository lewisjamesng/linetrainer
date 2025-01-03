import { useChessContext } from "@/app/contexts/ChessContext";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./LineSelector.module.css";

export declare type Line = {
  name: string;
  position: string;
};

const LineSelector = () => {
  const [lines, setLines] = useState<Line[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLines, setFilteredLines] = useState<Line[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLUListElement>(null); // Ref for the dropdown

  const { selectedLine, setSelectedLine } = useChessContext();

  useEffect(() => {
    // TODO: Import lines from db
    let startLines = [
      {
        name: "Sicilian Dragon",
        position:
          "r1bqk1nr/pp1pppbp/2n3p1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 6",
      },
      { name: "French Defense", position: "" },
      { name: "Caro-Kann Defense", position: "" },
      { name: "Queen's Gambit", position: "" },
    ];
    setLines(startLines);
    setFilteredLines(startLines);
  }, []);

  useEffect(() => {
    if (lines) {
      setFilteredLines(
        lines.filter((line) =>
          line.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, lines]);

  const handleSelect = (line: Line) => {
    setSelectedLine(line);
    setSearchTerm(line.name); // Set the input value to the selected line
    setShowSuggestions(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="mt-10">
      <div className={`${styles.lineSelector} mt-10 mx-5 pb-10`}>
        <div className="p-2">
          <input
            type="text"
            placeholder="Search lines..."
            value={searchTerm}
            onClick={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Show suggestions when typing
            }}
            className="borderborder p-2 w-full mb-2"
          />

          {showSuggestions && (
            <div className="relative">
              {filteredLines.length > 0 && (
                <ul
                  ref={dropdownRef}
                  className="absolute bg-white border border-gray-300 w-full z-10"
                >
                  {filteredLines.map((line, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(line)}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {line.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineSelector;
