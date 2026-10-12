INSERT INTO users (user_id, password, name)
VALUES
('branny', '$2b$10$9z.ASgQ3.xu4Go1D1gD/WuiCuXHJNpmp5uUoQ0DYuzBFWVtk6x1Yq', 'Branny'),
('alex', '$2b$10$D/lQqU0lmjx7W1DQFKD7Bu7SOYodH8TascsPL5KUaXZWrQIlfLXyG', 'Alex'),
('sam', '$2b$10$D/lQqU0lmjx7W1DQFKD7Bu7SOYodH8TascsPL5KUaXZWrQIlfLXyG', 'Sam');

INSERT INTO blogs
(creator_name, creator_user_id, title, body, date_created)
VALUES
(
    'Branny',
    'branny',
    'Welcome to My Mind Blog',
    'This is my first blog post! I created this website using Node.js, Express, EJS, and PostgreSQL.',
    CURRENT_TIMESTAMP
),
(
    'Alex',
    'alex',
    'Learning Web Development',
    'I have been learning how to build websites using JavaScript. Working with databases is an exciting next step.',
    CURRENT_TIMESTAMP
),
(
    'Sam',
    'sam',
    'My Favorite Video Games',
    'I love playing video games in my free time. Some of my favorites are adventure games and survival horror games.',
    CURRENT_TIMESTAMP
),
(
    'Branny',
    'branny',
    'Why I Enjoy Programming',
    'Programming allows me to create things from scratch. It can be challenging, but solving problems is rewarding.',
    CURRENT_TIMESTAMP
),
(
    'Alex',
    'alex',
    'A Weekend Project',
    'This weekend I decided to work on a small web application. It was a great opportunity to practice my coding skills.',
    CURRENT_TIMESTAMP
);