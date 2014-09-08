#!/usr/bin/env ruby
require 'bundler'
Bundler.require

def main
  sources = sources(ARGV.shift)
  targets = Magick::ImageList.new

  sources.each do |source|
    colors = []
    color_size = source.colors
    blob = source.to_blob
    color_size.times do |index|
      colors << blob[20 + index, 3]
    end
    color_size.times do |index|
      blob[20 + index, 3] = colors.sample
    end
    targets << Magick::Image.from_blob(blob).first
  end

  targets.delay = sources.delay
  targets.iterations = 0
  targets.
    optimize_layers(Magick::OptimizeLayer).
    write('out.gif')
end

def sources(name)
  ::Magick::ImageList.new(name)
end

main
