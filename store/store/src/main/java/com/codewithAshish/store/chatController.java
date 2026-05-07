package com.codewithAshish.store;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class chatController{
      @PostMapping("/api/chat")
      public String chat(@RequestBody Map<String, String> body){
      
            String userMessage = body.get("message");
            // for now, just test
            System.out.println(userMessage);
            return "You said: " + userMessage;
      }   

}
