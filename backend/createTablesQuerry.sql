CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    is_admin BOOLEAN NOT NULL,
is_visible BOOLEAN NOT NULL,
last_login TIMESTAMP NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    abstract VARCHAR(250) NOT NULL,
    content VARCHAR(5000) NOT NULL,
    author INT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    FOREIGN KEY (author) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    producer VARCHAR(128) NOT NULL,
    critics_rate NUMERIC(3, 2),
    average_user_rate NUMERIC(3, 2) DEFAULT 0.00,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES games(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_user_game UNIQUE (user_id, game_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    entity_id INT NOT NULL,
type INT NOT NULL,
    user_id INT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE publication_votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    publication_id INT NOT NULL,
    liked BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (publication_id) REFERENCES publications(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_user_publication UNIQUE (user_id, publication_id)
);

CREATE TABLE comment_votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    liked BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_user_comment UNIQUE (user_id, comment_id)
);

CREATE TABLE favourites (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT unique_game_user UNIQUE (game_id, user_id)
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
