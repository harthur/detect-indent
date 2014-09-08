require "colorize"

module Adjuster

  def self.method_time 
    Adjuster.measure {BetterBenchmark.new}
  end

  def self.block_time 
    x = measure {yield}
    y = Adjuster.method_time
    (x - y)
  end

  def self.measure 
    before = Time.now
      yield
    after = Time.now
    ((after - before) * 1000) 
  end
end

module Report

  def self.output output1, output2, label1, label2, color1, color2
    $stdout.sync = true

    if output1 > output2
      loser = output1
      loser_label = label1
      winner = output2
      winner_label = label2
    elsif output1 < output2
      winner = output1
      winner_label = label1
      loser = output2
      loser_label = label2
    else
      Report.seperator
      puts "#{output1} #{Report.arrow} #{winner.to_s.colorize(color: color1)}ms"
      Report.seperator
      puts "#{output2} #{Report.arrow} #{loser.to_s.colorize(color: color1)}ms"
      Report.seperator
    end
    Report.seperator
    puts "#{winner_label} #{Report.arrow} #{winner.to_s.colorize(color: color1)}ms"
    Report.seperator
    puts "#{loser_label} #{Report.arrow} #{loser.to_s.colorize(color: color2)}ms"
    Report.seperator
  end

  def self.arrow
    " --------------> ".colorize(color: :light_blue)
  end

  def self.seperator
   puts "=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"
  end

end

class BetterBenchmark

  include Adjuster
  include Report

  def initialize args={}
    @color1 = args.fetch(:color1, nil)
    @color2 = args.fetch(:color2, nil)
  end

  def measure label = "" 
    @label1 = label
    @block1 = Adjuster.block_time {yield}
  end

  def and_compare label = ""
    @label2 = label
    @block2 = Adjuster.block_time {yield}
    total
  end

  def total
    Report.output @block1, @block2, @label1, @label2, @color1, @color2
  end

  def seperator
    puts "=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"
  end

end

