require 'rubygems'
require 'ruby-dictionary'

class BoggleGame
  attr_accessor :tiles, :words, :dictionary, :input

  def initialize(array_of_array)
    @tiles = []
    @words = []
    @input = array_of_array
  end

  def discover
    populate_tiles
    Word.new(self).discover
  end

  def populate_tiles
    @input.each_with_index do |letter_array, i|
      letter_array.each_with_index do |letter, j|
        @tiles << Tile.new(self, i + 1, j + 1, letter)
      end
    end
  end

  def dimension
    @input.length
  end

  def unique_words
    @words.map(&:to_s).uniq
  end
end

class Tile
  attr_accessor :game, :x, :y, :letter, :neighbors

  def initialize(game, x, y, letter)
    @game = game
    @x = x
    @y = y
    @letter = letter
  end

  def neighbors
    @neighbors ||= @game.tiles.select { |tile| neighbor?(tile) } - [self]
  end

  def neighbor?(tile)
    horizontal_neighbor?(tile) || vertical_neighbor?(tile) || diagonal_neighbor?(tile)
  end

  def horizontal_neighbor?(tile)
    (tile.x - x).abs == 1 && tile.y == y
  end

  def vertical_neighbor?(tile)
    (tile.y - y).abs == 1 && tile.x == x
  end

  def diagonal_neighbor?(tile)
    (tile.x - x).abs == 1 && (tile.y - y).abs == 1
  end
end

class Word
  attr_accessor :game, :tiles

  def initialize(game, tiles = [])
    @game = game
    @tiles = tiles
  end

  def to_s
    @tiles.map(&:letter).join.upcase
  end

  def child_words
    possible_next_tiles.map { |tile| self.class.new(game, self.tiles + [tile]) }
  end

  def possible_next_tiles
    @tiles.empty? ? game.tiles : @tiles.last.neighbors - @tiles
  end

  def discover
    valid_words = child_words.select(&:is_valid?)
    game.words = game.words | valid_words.select(&:is_word?)
    valid_words.map(&:discover)
  end

  def dictionary
    EnglishDictionary.cached
  end

  def is_valid?
    !dictionary.starting_with(to_s).empty?
  end

  def is_word?
    dictionary.exists?(to_s) && to_s.length >= 5
  end
end

# Additional Code
#
class EnglishDictionary
  def self.cached
    @dictionary ||=
      begin
        puts "Building dictionary..."
        Dictionary.from_file('/usr/share/dict/words')
      end
  end
end

class BogglePrinter
  def initialize(game)
    @game = game
  end

  def print_game
    puts "\nThe Boggle Game\n"
    print_tiles(@game.tiles)
  end

  def print_words
    puts "\nHow to find the words\n"
    @game.words.each do |word|
      puts word.to_s.upcase
      print_tiles(word.tiles)
    end
  end

  def list_words
   puts "#{@game.unique_words.count} words found."
   p @game.unique_words
   puts
  end

  private

  def print_tiles(tiles)
    range = (1..@game.dimension)
    range.each do |x|
      range.each do |y|
        tile = tiles.detect{|t| t.x == x && t.y == y}
        putc tile ? tile.letter.upcase : "*"
        putc " "
      end
      putc "\n"
    end
    puts
  end
end
