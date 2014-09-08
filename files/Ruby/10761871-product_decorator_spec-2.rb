    context "Searching" do
      let!(:taxon) { create(:taxon, name: "shirts") }
      let!(:taxon2) { create(:taxon, name: "shoes") }
      let!(:a_product) { create(:product, taxons: [taxon], stores: [store],
          description: "A product in english", price: 20) }
      let!(:another_product) { create(:product, taxons: [taxon, taxon2], stores: [store], price: 80) }
    end