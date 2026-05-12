package com.codewithAshish.service;

import com.google.genai.types.Part;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
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
			Content systemInstruction = Content.fromParts(
            Part.fromText("""
                You are a professional doctor.
                Only answer medical-related queries such as symptoms,
                diseases, medications, treatments and health advice.
                If the user asks anything unrelated to medicine or health,
                respond with: I am sorry, I can only assist with medical questions.
                """)
        );
			GenerateContentConfig config = GenerateContentConfig.builder() 
			.systemInstruction(systemInstruction).build();
			GenerateContentResponse response = client.models.generateContent("gemini-2.0-flash-lite",prompt,config);
			return response.text();

		}catch(Exception e){
			e.printStackTrace();
			System.out.println(e.getMessage());
			return "Gemini is currently busy, please try again in a moment.";
		}
	}
}