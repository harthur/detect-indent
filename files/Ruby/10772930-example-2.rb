require 'minitest/autorun'

describe "#lines_after_word(lines, target)" do
  let(:lines) { File.readlines(File.expand_path("../innisfree.txt", __FILE__)) }

  it "must return an empty array if no lines include the target word" do
    lines_after_word(lines, "hola").must_equal []
  end
end