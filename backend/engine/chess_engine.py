from dataclasses import dataclass
from time import perf_counter

from chess import WHITE, Board


def alpha_beta_search(alpha: int, beta: int, depth: int, board: Board):
    """
    Performs a Negamax search with alpha-beta pruning to find the best move.

    Parameters:
    alpha: Represents the min score / eval the maximising player is assured of assuming optimal play from both sides.
    beta: Represents the max score / eval the the minimising player can get. The maximising player will avoid this move if it's higher than the alpha they can achieve.
    depth: The search depth
    board: A Board object representing the current state of the chess board

    Returns:
    best_score: Current position evaluation
    best_moves: The principle line containing the top moves from each player
    """
    if depth == 0:
        # TODO: return a quiescence search to make the engine more stable (https://www.chessprogramming.org/Quiescence_Search)
        return evaluate_position(board), []

    best_score = -float("inf")
    best_moves = []
    legal_moves = board.legal_moves
    for move in legal_moves:
        board.push(move)
        score, candidate_path = alpha_beta_search(-beta, -alpha, depth - 1, board)
        score *= -1
        board.pop()

        if score > best_score:
            best_score = score
            best_moves = [board.san(move)] + candidate_path

            if score > alpha:
                alpha = score

        if score >= beta:
            break

    return best_score, best_moves


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

        eval, best_line = alpha_beta_search(float("-inf"), float("inf"), 6, board)
        move = best_line[0]
        board.push_san(move)

        return move, eval, board.fen(), best_line
