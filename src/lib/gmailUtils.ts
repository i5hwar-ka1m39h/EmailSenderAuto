import {google} from "googleapis"
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URL
const refresh_token = process.env.REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri)
oauth2Client.setCredentials({refresh_token:refresh_token});

export const gmail = google.gmail({version:"v1", auth:oauth2Client})