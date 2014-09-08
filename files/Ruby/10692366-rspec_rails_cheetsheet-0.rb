#Model 

@user.should have(1).error_on(:username) # Checks whether there is an error in username 
@user.errors[:username].should include("can't be blank")  # check for the error message 

#Rendering
response.should render_template(:index)

#Redirecting 
response.should redirect_to(movies_path)

#Capybara Matchers

response.body.should have_content("Hello world")
response.body.should have_no_content("Hello world")

response.body.should have_css("input#movie_title")
response.body.should have_css("input#movie_title", :value => "Twelve Angry Men")
response.body.should have_css("input", :count => 3) #True if there are 3 input tags in response
response.body.should have_css("input", :maximum => 3) # True if there or fewer or equal to 3 input tags 
response.body.should have_css("input", :minimum => 3) # True if there are minimum of 3 input tags 
response.body.should have_css("input", :between => 1..3) # True if there 1 to 3 input tags 
response.body.should have_css("p a", :text => "hello") # True if there is a anchor tag with text hello
response.body.should have_css("p a", :text => /[hH]ello(.+)/i) 
                                                   # True if there is a anchor tag with text matching regex

response.body.should have_xpath("//a")
response.body.should have_xpath("//a",:href => "google.com")
response.body.should have_xpath("//a[@href => 'google.com']")
response.body.should have_xpath("//a[contains(.,'some string')]")
response.body.should have_xpath("//p//a", :text => /re[dab]i/i, :count => 1)


# can take both xpath and css as input and can take arguments similar to both have_css and have_xpath
response.body.should have_selector(:xpath, "//p/h1")
response.body.should have_selector(:css, "p a#movie_edit_path")

# For making capybara to take css as default selector
Capybara.default_selector = :css
response.body.should have_selector("input")   #checks for the presence of the input tag
response.body.should have_selector("input", :value =>"Twelve Angry Men") # checks for input tag with value
response.body.should have_no_selector("input") 

# For making capybara to take css as default selector
Capybara.default_selector = :xpath
response.body.should have_selector("//input")   #checks for the presence of the input tag
response.body.should have_selector("//input", :value =>"Twelve Angry Men") # checks for input tag with value


# To access elements inside form 
response.body.should have_field("FirstName")  # checks for presence of a input field named FirstName in a form
response.body.should have_field("FirstName", :value => "Rambo")
response.body.should have_field("FirstName", :with => "Rambo")

response.body.should have_link("Foo")
response.body.should have_link("Foo", :href=>"googl.com")
response.body.should have_no_link("Foo", :href=>"google.com")


