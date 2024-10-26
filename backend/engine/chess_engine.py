import io
from dataclasses import dataclass

from chess import Board, WHITE


def evaluate_position(board: Board) -> float:
    # TODO: consider piece mobility in evaluation (https://www.chessprogramming.org/Evaluation)
    piece_value = {"p": 1, "b": 3, "n": 3, "r": 5, "q": 9, "k": 200}
    board_pieces = board.fen().split(" ")[0]

    white_material_score = 0
    black_material_score = 0
    for char in board_pieces:
        if char.isdigit() or char == "/":
            continue
        elif char.isupper():
            white_material_score += piece_value[char.lower()]
        else:
            black_material_score += piece_value[char]

    # return the score relative to the side to move
    is_white_turn = 1 if board.turn == WHITE else -1
    return (white_material_score - black_material_score) * is_white_turn


class ChessEngine:
    def analyse(self, position_fen: str):
        board = Board(position_fen)
        legal_moves = board.legal_moves
        eval = evaluate_position(board)
        print(eval)

        return "variations"