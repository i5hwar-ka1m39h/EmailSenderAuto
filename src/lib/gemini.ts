import { GoogleGenAI, Type } from "@google/genai"


const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey:apiKey
})

export const getRespsonse = async(textContent:string, userData:string) =>{
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:`
        Task: You have been given a raw text data from LinkedIn post and User data. 
        Your work is to extract the structured job information from the given text and create a short email of 3 to 4 lines to apply to the job according to the user data.
        The email should be short and humble, it should also contain a line which show resume attachment.
        Post:"${textContent}" userData:${userData}. Return the result strictly as JSON matching schema.  `,
        config:{
            responseMimeType:"application/json",
            responseSchema:{
                type:Type.OBJECT,
                properties:{
                    postBy:{
                        type:Type.STRING
                    },
                    jobTitle:{
                        type:Type.STRING
                    },
                    companyName:{
                        type:Type.STRING
                    },
                    experience:{
                        type:Type.NUMBER
                    },
                    jobRequirements:{
                        type:Type.ARRAY,
                        items:{
                            type:Type.STRING
                        }
                    },
                    hrEmailIds:{
                        type:Type.ARRAY,
                        items:{
                            type:Type.STRING
                        }
                    },
                    emailSubject:{
                        type:Type.STRING
                    },
                    emailBody:{
                        type:Type.STRING
                    }

                }
            }
        }
    })

    return response;
}