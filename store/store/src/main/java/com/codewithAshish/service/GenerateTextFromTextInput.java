package com.codewithAshish.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GenerateTextFromTextInput {
	private final Client client;
	GenerateTextFromTextInput(@Value("${gemini.api.key}") String apiKey){
		client = Client.builder().apiKey(apiKey).build();
	}
	public String prompt(String prompt){
		
		try{
			GenerateContentResponse response = client.models.generateContent("gemini-3-flash-preview",prompt,null);
			return response.text();

		}catch(Exception e){
			e.printStackTrace();
			return "Something went wrong";
		}
	}
}