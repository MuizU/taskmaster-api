# Taskmaster API 🚀

This is a RESTful API built with Node.js for managing tasks. It provides a simiple, yet robust backend for a to-do application, leveraging PostgreSQL as the persistent data store.


# ⚙️ How it works
The application follows a standard client-server architecture. Your Express.js server exposes a series of API endpoints athat handle HTTP requests from a client-side application. The server acts as a middleman, receiving these requests and interacting with a PostgreSQL databse to perform CRUD operations on your tasks. It uses the `node-postgres` library (`pg`) to manage the CRUD operations and executre SQL queries, ensuring a secure and efficient data flow.

# ✨Features

* **Create:** Add a new task to the database.
* **Read:** Retrieve a list of all tasks.
* **Update:** Modify an existing task's details.
* **Delete:** Remove a task from the database.

# 🛠️ Prerequisites

* Node.js (LTS version recommended)
* PostgreSQL
* npm (or yarn)


# 🚀 Getting Started

1. **Clone the repository:**

    `git clone https://github.com/MuizU/taskmaster-api.git`


    `cd taskmaster-api`

2. **Install dependencies:**
<br>

    `npm install`

3. **Set up the database**
* Ensure your PostgreSQL server is runnign.
* Create a databse and a `todos` table using a cli tool or a GUI like pgAdmin.

4. **Configure environment variables:**
* Create a `.env` file in the project root.
* Add your database credentials to the file.

5. **Run the application**
<br>

    `npm start`
