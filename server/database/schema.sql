create table user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(12) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_pic VARCHAR(255)
);

create table item (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_name VARCHAR(50) UNIQUE NOT NULL,
  item_description TEXT NOT NULL,
  item_image VARCHAR(255)
);

create table ranking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  ranking INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (item_id) REFERENCES item(id)
);
