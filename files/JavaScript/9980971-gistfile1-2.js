transact: function (action) {
      //If there is an ongoing transaction, use it. This is required to
      //support nested transactions.
      if (domainContext.transaction) {
        return action();
      }

      return db.transaction(function (tx) {
        domainContext.transaction = tx;
        //Execute the action
        return action()
          .then(function (result) {
            //Commit on success
            tx.commit(result);
          }, function (err) {
            //Rollback on failure
            tx.rollback(err);
          });
      }).finally(function () {
          //Clear out the transaction from the domain context!
          domainContext.transaction = null;
        });
    }