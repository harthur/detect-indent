    add: function(type) {
      var name = this.get('controller.newRecordName') || 'New Bridge %@'.fmt(Math.floor(Math.random()*1000));

      var record = {
        name: name,
        tenantId: '3fb9256165bc4a3baca3c06a45ff4018'
      };

      var url = [EmberENV.api_host, EmberENV.api_namespace, type].join('/');
      var token = this.session.get('token');
      var newType = type.classify().singularize();
      var prefix = this.container.lookup('adapter:application').get('collectionMediaTypePrefix');
      var version = this.container.lookup('adapter:application').get('defaultAPIVersion');
      var accept = '%@.%@%@+json'.fmt(prefix, newType, version);

      var headers = {
        "X-Auth-Token": token,
        "Accept": accept
      };

      var hash = {};
      hash.url = url;
      hash.type = 'POST';
      hash.dataType = 'json';
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(record);

      hash.beforeSend = function (xhr) {
        [].forEach.call(Ember.keys(headers), function(key) {
          xhr.setRequestHeader(key, headers[key]);
        });
      };

      Ember.$.ajax(hash).fail(function (response) {
        var recordURL = response.getResponseHeader('Location');
        Ember.$.getJSON(recordURL).done(function (data) {
          console.log('data', data);
          // Make sure that the record is not already in the store before adding it
          if ( !this.get('store').recordIsLoaded(type.singularize(), data.id) ) {
            console.log('Pushing record', data.name, data);
            this.get('store').pushPayload(type.singularize(), data);
          }
          else {
            // Update all existing records
            console.log('Updating record', data.name, data);
            this.get('store').update(type.singularize(), data);
          }
        }.bind(this));

        this.set('controller.newRecordName', '');
      }.bind(this));

    },
