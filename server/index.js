import process from 'node:process' 
import app from './app.js' 
 
const port = Number(process.env.PORT) || 4000 
 
app.listen(port, () => { 
  console.log(`GovtChatBot backend running on http://localhost:${port}`) 
})
