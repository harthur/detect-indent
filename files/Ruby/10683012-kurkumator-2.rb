require 'text'

class Kurkumator
  def ko_list
    %w[путин рашка пук свежо аутизм быдло говно скатывать скатываешь сыч чухан спайс куркума поссал нассал обосрал для быдла лох лол лул хуле лях мюсли бнв дедфуд личкрафт тян кун форсить форс отсос соснул гей прыщи твою анус ле yay лойс маман аутист кукарек зафорсил шиндошс гейос ябл линуск двач рак мамка борщ лисп хаскель кококо]
  end

  def max_diff
    10
  end

  def find_nearest word
    res = nil
    ldiff = max_diff
    ko_list.each do |ko|
      cdiff = Text::Levenshtein.distance(ko, word)
      if ldiff > cdiff
        res = ko
        ldiff = cdiff
      end
    end

    res
  end

  def kokoify text
    text.gsub(/\b([а-яА-Я]+)\b/) do |found|
      if found.length > 3
        find_nearest found
      else
        found
      end
    end
  end
end

p Kurkumator::new.kokoify ARGV[0]