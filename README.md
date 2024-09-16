[![Header](https://github.com/NoeGarcia/book-reviews/blob/main/public/images/gitHeader.png?raw=true)](https://github.com/NoeGarcia/book-reviews/)
# Book reviews (book-reviews)
***
The **book-reviews** website is designed to display a list of books reviews and of course add new reviews, edit them or delete them.

In addition, the site provides a search engine to facilitate the location of a specific book review since the list could become quite extensive at certain moment and it would be difficult to find a particular book among all of them.

## Technologies used
Built with Node.js, Express.js, EJS and with the help of some Javascript, it uses the [openlibrary.org ISBN API ](https://openlibrary.org/dev/docs/api/books) to get the book covers. The openlibrary.org has several book's search APIs and all of them are public and can be accessed without authentication.  

Here's how the site looks like:  
![Book-reviews site sample](https://github.com/NoeGarcia/book-reviews/blob/main/public/images/gitDetailsPage.png?raw=true)

## How to clone and build it
To get the site up and running on your local machine, follow these steps: 
1. Clone the repository:  
    `git clone https://github.com/NoeGarcia/book-reviews.git`

2. Install Dependencies (after you're sure that you have Node.js installed):  
	`npm install`

3. Download and install PostgreSQL on your developemnt machine from:  
	`https://www.enterprisedb.com/downloads/postgres-postgresql-downloads`

4. Create a database and name it whatever you like. For example:  
	`book-reviews`  

5. Create 2 tables on the database you created on step 4 and name them:  
	`books`  
	and  
	`reviews`  
	To help you, I've added a file in the root of this repository called SQL Queries.txt, with the 2 queries to create this tables. Just copy them and paste them in a pgAdmin Query editor window and execute them.  

6. Create a .env file into the root folder of the project. The file should be named like that (.env), node.js, express.js and gitHub recognize it like that. And declare the following Environment Variables to be used in the pg.Pool() configuration to read and write in your recentrly created database/tables of steps 4 and 5:  
	`DB_HOST=NameOfYourPosgreSQLServerInstance usually localhost`  
	`DB_PORT=ThePosgreSQLServerPort usually 5432`  
	`DB_USER=YourUserNameForPosgreSQLServer usually postgres`  
	`DB_PASSWORD=ThePasswordYouSetForYourPosgreSQLServer`  
	`DB_NAME=NameOfTheDatabaseYouCreatedOnStep4`  

7. Comment or erase the lines with the following configuration for the pg.Pool() connection in the Index,js file. That part is not needed for local databases:  
	`ssl: {`  
    `    rejectUnauthorized: true,`  
    `    ca: process.env.DB_SSL_CERT,`  
    `},`  

8. Add all the express modules required (they are listed in the package.json file) by building the project with:  
	`npm i`  

9. Start the server (you can use node or nodemon):  
	`node index.js`  
	or  
	`nodemon index.js`
10. Open your browser:  
	`Navigate to 'http://localhost:3000' to view the app.`
	
## Online demo
You can see a ***[live demo](https://book-reviews-3eq7.onrender.com)*** powered by Render.com

## Motivation for this project
The reason for developing this project is to complete the capstone project of the section on learning how to use postgreSQL as a repository that is part of the course "The Complete 2024 Web Development Bootcamp" available on Udemy.
