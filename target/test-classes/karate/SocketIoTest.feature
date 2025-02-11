Feature: Test Socket.IO and REST API using a Java helper

  Scenario: Send a message and verify response and storage
    * def message = 'Hello from Karate!'
    * def SocketIoClient = Java.type('my.mypackage.SocketIoClient')
    * def client = new SocketIoClient('http://localhost:8080/chat')
    * def response = client.sendMessage(message)
    * print 'Response from Socket.IO server:', response
    * match response contains 'Server received'

    # Wait 1 second for the REST API to store the message
    * eval Java.type("java.lang.Thread").sleep(1000)

    Given url 'http://localhost:5000/messages'
    When method GET
    Then status 200
    And match response[0].message == message
