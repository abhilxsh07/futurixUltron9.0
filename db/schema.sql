CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('participant','admin') NOT NULL DEFAULT 'participant',
  created_at DATETIME NOT NULL
);

CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  INDEX (token_hash),
  INDEX (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  project_name VARCHAR(160) NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  use_case TEXT NOT NULL,
  challenges TEXT NOT NULL,
  tech_stack_json TEXT NOT NULL,
  compatibility VARCHAR(80) NOT NULL,
  compatibility_details TEXT NULL,
  team_name VARCHAR(160) NOT NULL,
  team_members_json TEXT NOT NULL,
  links_json TEXT NOT NULL,
  screenshots_json TEXT NULL,
  track VARCHAR(120) NULL,
  likes_count INT NOT NULL DEFAULT 0,
  status ENUM('pending','approved','hidden') NOT NULL DEFAULT 'pending',
  created_by_user_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);
