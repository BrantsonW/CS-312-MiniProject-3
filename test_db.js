const db = require("./db");

//Test PostgreSQL connection
async function testConnection()
{
    try
    {
        const users = await db.query("SELECT COUNT(*) FROM users");
        const blogs = await db.query("SELECT COUNT(*) FROM blogs");

        console.log("Connected to PostgreSQL!");
        console.log("Users:", users.rows[0].count);
        console.log("Blog posts:", blogs.rows[0].count);
    }
    catch (error)
    {
        console.error("Database connection failed:", error.message);
    }
    finally
    {
        await db.end();
    }
}

//Actually run the function
testConnection();