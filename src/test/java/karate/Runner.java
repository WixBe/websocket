package karate;

import com.intuit.karate.junit5.Karate;

class Runner {
    
    @Karate.Test
    Karate testAll() {
        return Karate.run("SocketIoTest").relativeTo(getClass());
    }
}
