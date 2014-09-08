shared_examples ".model valid min length" do | params |

  describe "length min "+(params[:length]).to_s do
    before do
      @model = params[:model].new

      @model[params[:attr_name]] = "A"*(params[:length]-1)
    end

    it "should be invalid" do
      @model.valid?.should be_false
      @model.errors[params[:attr_name]].should_not be_nil
      @model.errors[params[:attr_name]].length.should > 0

    end
  end
end