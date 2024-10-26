from dataclasses import dataclass

from chess import WHITE, Board, Move


def nega_max_search(depth: int, board: Board):
    if depth == 0:
        return evaluate_position(board), []

    max = -float("inf")
    legal_moves = board.legal_moves
    for move in legal_moves:
        board.push(move)
        score, candidate_path = nega_max_search(depth - 1, board)
        score *= -1
        board.pop()
        if score > max:
            max = score
            best_moves = [board.san(move)] + candidate_path

    return max, best_moves


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

        max, best_moves = nega_max_search(3, board)

        return "variations"
