def hashify(rows)
 rows[1..-1].map { |row| Hash[rows.first.zip(row)] }
end