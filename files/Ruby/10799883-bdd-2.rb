class Fifo
  EmptyError = Class.new(Exception)
  Node = Struct.new(:value, :next)

  attr_accessor :size, :top
  private :size=, :top=


  def initialize
    self.size = 0
    self.top = nil
  end

  def empty?
    size.zero?
  end

  def pop
    raise EmptyError if empty?
    self.size = size - 1
    value, self.top = top.value, top.next
    value
  end

  def push(element)
    self.size = size + 1
    self.top = Node.new(element, top)
  end
end

describe Fifo do
  context "when it is new" do
    it do
      is_expected.to be_empty
    end

    specify do
      expect(subject.size).to be_zero
    end

    specify do
      expect{ subject.pop }.to raise_error Fifo::EmptyError
    end

    specify do
      expect{ subject.push :element }.to change{ subject.size }.by(1)
    end
  end

  context "with one element" do
    before do
      subject.push :element
    end

    it do
      is_expected.to_not be_empty
    end

    specify do
      expect(subject.size).to eql(1)
    end

    describe "popping an element" do
      specify do
        expect{ subject.pop }.to change{ subject.size }.by(-1)
      end

      specify do
        expect(subject.pop).to eql(:element)
      end
    end
  end

  context "with more than one element" do
    before do
      subject.push :first_element
      subject.push :second_element
    end

    specify do
        expect(subject.pop).to eql(:second_element)
    end

    specify do
      subject.pop
      expect(subject.pop).to eql(:first_element)
    end
  end
end


__END__

push
pop
empty
top
