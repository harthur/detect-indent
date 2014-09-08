import unittest
from solution import validate_nonogram


class TestValidateNonogram(unittest.TestCase):

    def test_validate_nonogram1(self):
        rows = [[4], [6], [3, 2], [3, 1, 1], [3, 3],
                     [5, 1], [8], [10], [7, 3]]
        cols = [[1], [2], [3], [4], [6], [7], [8], [3, 3],
                      [2, 2], [2, 1, 3], [3, 2, 2], [4, 1], [1], [0], [0]]
        keys = {'rows': rows, 'columns': cols}
        nonogram = [
            [' ',' ',' ',' ',' ',' ',' ','X','X','X','X',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ','X','X','X','X','X','X',' ',' ',' '],
            [' ',' ',' ',' ',' ','X','X','X',' ',' ','X','X',' ',' ',' '],
            [' ',' ',' ',' ','X','X','X',' ',' ','X',' ','X',' ',' ',' '],
            [' ',' ',' ',' ','X','X','X',' ',' ',' ','X','X','X',' ',' '],
            [' ',' ',' ','X','X','X','X','X',' ',' ','X',' ',' ',' ',' '],
            [' ',' ','X','X','X','X','X','X','X','X',' ',' ',' ',' ',' '],
            [' ','X','X','X','X','X','X','X','X','X','X',' ',' ',' ',' '],
            ['X','X','X','X','X','X','X',' ',' ','X','X','X',' ',' ',' ']
        ]
        self.assertTrue(validate_nonogram(nonogram, keys))

    def test_validate_nonogram2(self):
        rows = [[0], [0], [0], [0], [0], [0]]
        cols = [[0], [0], [0], [0], [0], [0]]
        keys = {'rows': rows, 'columns': cols}
        nonogram = [
            [' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' '],
            [' ',' ',' ',' ',' ',' ']
        ]
        self.assertTrue(validate_nonogram(nonogram, keys))

    def test_validate_nonogram3(self):
        rows = [[1, 1, 1], [1, 1, 1], [1, 1, 1],
                [1, 1, 1], [1, 1, 1], [1, 1, 1]]
        cols = [[1, 1, 1], [1, 1, 1], [1, 1, 1],
                [1, 1, 1], [1, 1, 1], [1, 1, 1]]
        keys = {'rows': rows, 'columns': cols}
        nonogram = [
            ['X',' ','X',' ','X',' '],
            [' ','X',' ','X',' ','X'],
            ['X',' ','X',' ','X',' '],
            [' ','X',' ','X',' ','X'],
            ['X',' ','X',' ','X',' '],
            [' ','X',' ','X',' ','X']
        ]
        self.assertTrue(validate_nonogram(nonogram, keys))

    def test_validate_nonogram4(self):
        rows = [[6], [1, 2, 1], [1, 2, 1], [1, 2, 1], [1, 2, 1], [6]]
        cols = [[6], [1, 1], [2, 3], [6], [1, 1], [6]]
        keys = {'rows': rows, 'columns': cols}
        nonogram = [
            ['X','X','X','X','X','X'],
            ['X',' ','X','X',' ','X'],
            ['X',' ',' ','X',' ','X'],
            ['X',' ','X','X',' ','X'],
            ['X',' ','X','X',' ','X'],
            ['X','X','X','X','X','X']
        ]
        self.assertFalse(validate_nonogram(nonogram, keys))


if __name__ == '__main__':
    unittest.main()