Feature: Test Socket.IO and REST API

Scenario: Send a message and verify storage
    * def socket = karate.callSingle('file:karate-tests/karate-socket.js')

    Given url 'http://localhost:8080/chat'
    And def message = 'Hello from Karate!'
    When def response = socket.sendMessage(message)
    Then print 'Sent message:', response

    # Wait 1 second for message storage
    * karate.delay(1000)

    Given url 'http://localhost:5000/messages'
    When method GET
    Then status 200
    And match response[0].message == message
