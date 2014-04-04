transactor.run(function () {
    return self.insert(atom)
      .then(function (atom) {
        var electron = particleService.insertElectron(atom);
        return Promise.all([atom, electron]);
      }).spread(function (atom, electron) {
        atom.electrons = [electron];
        return atom;
      });
  });