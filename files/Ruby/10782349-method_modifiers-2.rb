module MethodModifiers
  def privatize
    on_method_defined do |klass, method|
      Priv.call klass, method
    end
  end

  def memoize
    on_method_defined do |klass, method|
      Memo.call klass, method
    end
  end

  def on_method_defined &block
    klass = self
    added = false
    (@blocks ||= []) << block
    define_singleton_method :method_added do |method|
      !added and added = true and @blocks.each { |b| b[klass, method] } and @blocks = []
    end
  end
  private :on_method_defined

  Priv = ->(klass, method) { klass.send :private, method }

  module Memo
    def self.call klass, method
      memoless = "[memoless]#{method}"
      klass.send :alias_method, memoless, method

      cache = {}
      klass.send :define_method, method do |*args, &block|
        return cache[args] if cache.key? args
        send(memoless, *args, &block).tap { |v| cache[args] = v }
      end
    end
  end
end

require 'minitest/autorun'

describe MethodModifiers do
  let(:modified_class) do
    Class.new do
      extend MethodModifiers

      memoize
      def memoized param
        param.call
      end

      privatize
      def privatized
      end

      memoize
      privatize
      def combined param
        param.call
      end

      def exposed param
        combined param
      end
    end
  end

  it 'memoizes method' do
    param = Struct.new(:call_count) do
      def call; self.call_count ||= 0 and self.call_count += 1 end
    end.new

    instance = modified_class.new
    instance.memoized param
    instance.memoized param

    param.call_count.must_equal 1
  end

  it 'privatizes method' do
    modified_class.new.private_methods.must_include :privatized
  end

  it 'memoizes and privatizes method' do
    param = Struct.new(:call_count) do
      def call; self.call_count ||= 0 and self.call_count += 1 end
    end.new

    instance = modified_class.new
    instance.exposed param
    instance.exposed param

    instance.private_methods.must_include :combined
    param.call_count.must_equal 1
  end

  it 'leaves subsequent methods untouched' do
    modified_class.new.public_methods.must_include :exposed
  end
end