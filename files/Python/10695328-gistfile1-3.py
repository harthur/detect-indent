Option #1

class ProductCatSubCat(model):
   product = ForeignKey("Product")
   cat = ForeignKey("Category")
   SubCat = ForeignKey("SubCategory")


Option #2

class CatSubcat(model):
   cat = ForeignKey("Category")
   subCat = ForeignKey("SubCategory")

   def __unicode__(self):
      return self.cat.name + " " + self.subCat.name

class Product(model):
  ...
  product = ManyToMany("CatSubcat")
