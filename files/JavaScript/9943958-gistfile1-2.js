updatePageMessaging = function updatePageMessaging($swatch) {

    // setup
    var currentSelectedFinish, stock, hideOutOfStockMessage, isAvailable;
    currentSelectedFinish = $swatch || getSelectedFinish();

    // If a finish is selected, grab stock and hideOoSM
    if (currentSelectedFinish.length) {
      // Get stock count
      stock = parseInt(currentSelectedFinish.data('stock'), 10);

      // Should we hide out of stock message?
      hideOutOfStockMessage = currentSelectedFinish.data("hidemessage") === true ? true : false;
    }

    /* availability by location vs not */
    if (hasAvailabilityByLocation()) {
      // GE  or Hotpoint

      // Is this the correct element that has the data we need?
      if (currentSelectedFinish.data("sku") === undefined) {
        // Guess not, lets climb up the DOM and find the element with stock and availability
        currentSelectedFinish = currentSelectedFinish.parent("li").find("div[data-name]");
        // Update stock count... again
        stock = parseInt(currentSelectedFinish.data("stock"), 10);
      }

      isAvailable = currentSelectedFinish.data("isavailable");

      // Always show fields
      $availabilityVaries.show();

      // Is a finish select
      if (isFinishSelected()) {

        // Is the postal code already defined
        if (isPostalCodeDefined()) {

          // Remove any error state classes
          $availabilityVaries.find('label').removeClass('prd_error_highlight');

          // Product Is available
          if (isAvailable) {

            // Hide Can't Ship Message
            pageMessaging.hideUnavailableByLocation();

            updateStockMessage($stockCount, stock).show();

            if (stock === 0) {
              // no stock
              $stockCount.hide();

              toggleAddToCart(false);

              if (hideOutOfStockMessage === false) {
                $stockZero.show();
              }
            } else if (stock > 0) {
              // Product has availability by location

              // Show stock
              $stockZero.hide();

              // NOTE: Should always be shown
              // $('.stock-messages').show();
              $leadTimeText.show();

              // Ensure that the configure / add to cart button is active
              toggleAddToCart(true);
            } else {
              if (hideOutOfStockMessage === false) {
                $stockCount.text('Out Of Stock').addClass('out-of-stock').show();
              }
            }
          } else {
            // Product is not available
            // Render Can't Ship Message
            pageMessaging.showUnavailableByLocation();

            /** Hide the following:
                - Current Stock
                - Out of Stock badge
                - Free shipping
                - Lead Time Text
                - Disable Add to Cart
              */
            $stockCount.hide();
            $stockZero.hide();
            $freeShipping.hide();
            $leadTimeText.hide();
            toggleAddToCart(false);
          }
        } else {
          toggleAddToCart(false);
        }
      } else {
        toggleAddToCart(false);
      }

    } else {
      // EVERY OTHER PRODUCT IN OUR CATALOG BUT GE & HOTPOINT
      // Huzzah!

      isAvailable = true;


      // Always show lead time text
      //
      $leadTimeText.show();
      if (stock === 0) {
        // Product has no inventory

        // Always hide the stockCount
        $stockCount.hide();


        if (hideOutOfStockMessage) {
          $stockZero.hide();
        } else {
          $stockZero.show();
        }
      } else if (stock > 0) {
        // Has stock

        // Hide Out of Stock in case it was previously shown
        $stockZero.hide();

        // Update Stock count and show
        updateStockMessage($stockCount, stock).show();
      } else {
        // If stock is unknown or previous logic fails for some reason
        if (hideOutOfStockMessage) {
          $stockZero.hide();
        } else {
          $stockZero.show();
        }
      }

    }
  };