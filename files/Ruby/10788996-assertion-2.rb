MiniTest::Assertions.class_eval do


  def assert_equal(subject, expected)
    subject == expected
  end

end
Array.infect_an_assertion :assert_hash, :must_be_hash