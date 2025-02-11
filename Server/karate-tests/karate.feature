Feature: Test Socket.IO and REST API

  Scenario: Send a message and verify storage
    * def message = 'Hello from Karate!'
    * def requestData = { message: message }
    * def response = karate.callSingle('file:karate-tests/karate-socket.js', requestData)
    * match response == { status: 'Message sent' }

    # Wait 1 second for message storage
    * call karate.delay(1000)

    Given url 'http://localhost:5000/messages'
    When method GET
    Then status 200
    And match response[0].message == message
