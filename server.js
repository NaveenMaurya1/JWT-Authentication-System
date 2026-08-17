import app from "./src/app.js"
const port = 3000
import connectDB from "./src/config/dataBase.js"

connectDB();

app.listen(port,()=>{
    console.log(`Server is running on https://localhost:${port}`)
})