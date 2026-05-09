package com.codewithAshish.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.codewithAshish.service.GenerateTextFromTextInput;


@RestController
public class chatController{
      @PostMapping("/api/chat")
      public String chat(@RequestBody Map<String, String> body){
      
            String userMessage = body.get("message");

            System.out.println(userMessage);
            GenerateTextFromTextInput service = new GenerateTextFromTextInput();
            String str = service.prompt(userMessage);
            return str;
      }   

}
