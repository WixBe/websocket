function fn() {
    var config = { myprop: 'myvalue', myurl: 'somevalue' };
    // Remove the callSingle below - it is not needed for configuration.
    // var result = karate.callSingle('classpath:karate-tests/karate.feature', config);
    return config;
  }
  