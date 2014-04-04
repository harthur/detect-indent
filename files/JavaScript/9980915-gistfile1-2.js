  get: function () {
    return hadronRepository.get()
      .then(mapper.toEntity);
  }