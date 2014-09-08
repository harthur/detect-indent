def fill_rows(rows):
    num_cols = [len(i) for i in rows]
    max_cols = max(num_cols)
    if min(num_cols) != max_cols:
        rows = [j + [None] * (max_cols - num_cols[i]) for i in rows]
    return rows
