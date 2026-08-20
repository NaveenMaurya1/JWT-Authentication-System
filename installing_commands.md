we added ....   "dev" : "npx nodemon server.js"   in package.json , now we can run the server through "npm run dev"

we need to use middleware so for that we gonna install a middleware function named "morgan"
"npm install morgan"

we need to install .env so for that ....
"npm install dotenv"

we need to install mongoose ..
"npm install mongoose"

To create a token in this we need a package name "jsonwebtoken"...
"npm install jsonwebtoken"
after that we need to generate JWT secret key , so we can use Jwt secret key genrator website.


accessToken = memory (access token stores in cookies)
refreshToken = cookies (refresh token stores in cookies)
so to store in cookies we have to install a package
"npm i cookie-parser" 


We have to install "nodemailer" to send otp through email for otp verification...
"npm install nodemailer" 