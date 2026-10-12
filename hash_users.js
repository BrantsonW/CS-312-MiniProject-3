const bcrypt = require("bcrypt");
const db = require("./db");

async function hashUsers()
{
    try
    {
        const users = await db.query(
            "SELECT user_id, password FROM users"
        );

        for (const user of users.rows)
        {
            if (user.password.startsWith("$2"))
            {
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            await db.query(
                "UPDATE users SET password = $1 WHERE user_id = $2",
                [hashedPassword, user.user_id]
            );
        }

        console.log("Sample user passwords updated!");
    }
    catch (error)
    {
        console.error("Error updating passwords:", error.message);
    }
    finally
    {
        await db.end();
    }
}

hashUsers();