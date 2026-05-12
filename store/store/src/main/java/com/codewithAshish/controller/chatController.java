package com.codewithAshish.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.codewithAshish.service.GenerateTextFromTextInput;


@RestController
public class chatController{

      private final GenerateTextFromTextInput service;

      chatController(GenerateTextFromTextInput service){
            this.service = service;
      }

      @PostMapping("/api/chat")
      public String chat(@RequestBody Map<String, List<Map<String, String>>> body){
            
            List<Map<String, String>> messages = body.get("messages");

            StringBuilder sb = new StringBuilder();
            for(Map<String, String> message: messages){
                  sb.append(message.get("user"));
                  sb.append(": ");
                  sb.append(message.get("content"));
                  sb.append("\n");
            }
            String str = service.prompt(sb.toString());
            System.out.println(str);
            return str;
      }   

}
