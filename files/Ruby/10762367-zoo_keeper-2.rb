require 'pry'
animals = {
  'leopard'   => 1,
  'gorilla'   => 3,
  'hippo'     => 4,
  'zebra'     => 1,
  'lion'      => 2,
  'eagle'     => 3,
  'ostrich'   => 2,
  'alligator' => 6
}

def starts_with_vowel(animals)
  vowel_animals = {}
  animals.each do |key, value|
    if key.start_with?("a", "e", "i", "o", "u")
      vowel_animals[key] = value
    end
  end
  vowel_animals
end

def lonely_animals(animals)
  solo_animals = {}
  animals.each do |key, value|
    if value < 2
      solo_animals[key] = value
    end
  end
  solo_animals
end

def total_animals(animals)
  sum = 0
  total = []
  animals.each { |key, value| total << value }
  total.each { |i| sum += i }
  sum
end

def add_new_animals(animals, new_shipment)
  new_shipment.each do |animal, count|
    if !animals.has_key?(animal)
      animals[animal] = count
    end
  end
  animals
end

def group_by_count(animals)

  animals_by_count = {}
  animals.each do |animal, count|

    animals_array = []
    if !animals_by_count.has_key?(count)
      animals_by_count[count] = animals_array << animal

    elsif animals_by_count.has_key?(count)
      animals_by_count[count] = animals_array << animal
      # I know that after every iteration the array is reset to be blank. 
      # Then in the elsif condition the animal_count hash is overwritten by the new array.
    end

  end
  animals_by_count
end
