package com.codewithAshish.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

public class GenerateTextFromTextInput {

	public Client client = Client.builder().apiKey("AIzaSyAPnB7SSfmCCkaUSKkHo-aArWzQNDY-Vrs").build();
  
	public String prompt(String prompt){
		GenerateContentResponse response = client.models.generateContent("gemini-3-flash-preview",prompt,null);
	return response.text();
}
}