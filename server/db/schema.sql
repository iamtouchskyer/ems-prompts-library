
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author_id INTEGER,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE change_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prompt_id INTEGER,
  user_id INTEGER,
  change_type TEXT NOT NULL,
  change_description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prompt_id) REFERENCES prompts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
