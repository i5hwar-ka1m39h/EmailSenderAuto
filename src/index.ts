import express, {Request, Response} from "express"
import cors from "cors"
import multer from 'multer'
import { getRespsonse } from "./lib/gemini"
import { gmail } from "./lib/gmailUtils"
import { buildMailwithAttachment } from "./lib/mimeBuilder"
import dotenv from 'dotenv'

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors())
const uplaod = multer()
const port = process.env.PORT || 8080;



app.post("/analyze", async(req:Request, res:Response)=>{
    const {text, userData} = req.body;
    try {
        const response = await getRespsonse(text, JSON.stringify(userData))

        if(!response) throw new Error("something went wrong!");

        const rawData = response.candidates![0].content?.parts![0].text;
        const data = rawData ? JSON.parse(rawData) : null;
        
        res.status(200).json({message:"response created successfully", data});
    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
})



app.post("/sendEmail", uplaod.single("file"),  async(req:Request, res:Response)=>{
    const {to,subject,  message} = req.body;
    const fileBuffer = req.file?.buffer;
    const fileName = req.file?.originalname;
    try {
        const rawData = await buildMailwithAttachment(
            {
                from:"me@gmail.com",
                to:to,
                subject:subject, 
                text:message,
                attachment:{
                    filename: fileName || "resume.pdf",
                    content: fileBuffer as Buffer
                }
            }
        )
        const result = gmail.users.messages.send({
            userId: "me", 
            requestBody: {raw:rawData}
        })

        if(!result) throw new Error("something went wrong while sending email");

        res.status(200).json({message:"email sent", result})
    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message})
        
    }
})




app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
    
})

