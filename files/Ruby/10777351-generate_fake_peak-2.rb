#!/usr/bin/env ruby

require 'distribution'
require 'gnuplot'
require 'csv'

params = {
  step: 0.01,
  stop: 1.0,
  xwiggle: 0.01,
  ywiggle: 0.05,
  gamma: [1,5],
}
params[:start] = params[:step]

class Float
  # flat random within +/- delta
  def wiggle(delta)
    self - delta + (rand * (delta*2))
  end
end

pure_xvals = (params[:start]..params[:stop]).step(params[:step]).to_a
pure_yvals = pure_xvals.map {|v| Distribution::Gamma.pdf(*params[:gamma],v) }

(xvals, yvals) = [[pure_xvals, params[:xwiggle]], [pure_yvals, params[:ywiggle]]].map do |array, delta|
  array.map {|v| v.wiggle(delta)}
end

xvals.sort! #ensure monotonic

CSV.open("fake_peak.csv", 'wb') do |csv|
  csv << %w(pure_x pure_y noisy_x noisy_y)
  [pure_xvals, pure_yvals, xvals, yvals].transpose.each do |array|
    csv << array
  end
end

Gnuplot.open do |gp|
  Gnuplot::Plot.new(gp) do |plot|
    plot.data << Gnuplot::DataSet.new([pure_xvals, pure_yvals]) do |ds|
      ds.title = "original signal"
      ds.with = "linespoints"
    end
    plot.data << Gnuplot::DataSet.new([xvals,yvals]) do |ds|
      ds.title = "signal with noise"
      ds.with = "points"
    end
  end
end