create table user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(12) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_pic VARCHAR(255) DEFAULT 'http://localhost:3000/src/assets/images/avatars/av01.png'
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

INSERT INTO item (item_name, item_description, item_image) VALUES
("Banane", "Quiconque entrera en contact avec cet objet perdra le contrôle de son véhicule.", "http://localhost:3000/src/assets/images/items/img_detail01.png"),
("Triple Banane", "Trois bananes gravitent autour de votre véhicule.", "http://localhost:3000/src/assets/images/items/img_detail02.png"),
("Carapace verte", "Cet objet file en ligne droite et renverse le premier véhicule qu'il touche.", "http://localhost:3000/src/assets/images/items/img_detail03.png"),
("Triple Carapace verte", "Trois carapaces vertes gravitent autour de votre véhicule.", "http://localhost:3000/src/assets/images/items/img_detail04.png"),
("Carapace rouge", "La carapace rouge se dirige automatiquement vers le véhicule qui vous précède, le poursuit, et renverse le premier véhicule qui croise sa route.", "http://localhost:3000/src/assets/images/items/img_detail05.png"),
("Triple Carapace rouge", "Trois carapaces rouges gravitent autour de votre véhicule.", "http://localhost:3000/src/assets/images/items/img_detail06.png"),
("Carapace bleue", "Cet objet poursuit le véhicule en tête de la course jusqu'à le renverser. Tout véhicule qui se trouve sur son chemin est également renversé.", "http://localhost:3000/src/assets/images/items/img_detail07.png"),
("Bob-omb", "Une fois lancé ou lâché, cet objet explose après quelque temps ou dès qu'il touche un véhicule.", "http://localhost:3000/src/assets/images/items/img_detail08.png"),
("Champignon", "Permet de faire une brève accélération.", "http://localhost:3000/src/assets/images/items/img_detail09.png"),
("Triple Champignon", "Trois champignons turbo gravitent autour de votre véhicule. Appuyez sur [L] pour les utiliser l'un après l'autre.", "http://localhost:3000/src/assets/images/items/img_detail10.png"),
("Champignon doré", "Vous permet, pendant un temps limité, de faire autant d'accélérations que vous le souhaitez en appuyant sur [L].", "http://localhost:3000/src/assets/images/items/img_detail11.png"),
("Bill Balle", "Cet objet vous transforme temporairement en Bill Balle. Celui-ci fonce à toute vitesse en suivant le tracé du circuit et en renversant les véhicules qui se trouvent sur son chemin.", "http://localhost:3000/src/assets/images/items/img_detail12.png"),
("Bloups", "Projette de l'encre sur tous les véhicules qui vous précèdent, ce qui a pour effet de gêner temporairement la vue des pilotes.", "http://localhost:3000/src/assets/images/items/img_detail13.png"),
("Éclair", "La foudre s'abat sur tous vos adversaires, ce qui a pour effet de les déposséder de leurs objets et de leur faire perdre de la vitesse en les rétrécissant!", "http://localhost:3000/src/assets/images/items/img_detail14.png"),
("Super Étoile", "Cet objet vous rend temporairement invincible. En outre, vous gagnez de la vitesse et il vous suffit de heurter un véhicule pour le renverser.", "http://localhost:3000/src/assets/images/items/img_detail15.png"),
("Fleur de feu", "Cet objet vous permet de lancer des boules de feu pendant quelque temps en appuyant sur [L]. Quiconque se fait toucher par l'une d'entre elles perd le contrôle de son véhicule.", "http://localhost:3000/src/assets/images/items/img_detail16.png"),
("Fleur boomerang", "Cet objet peut être lancé jusqu'à trois reprises. Quiconque se fait toucher par un boomerang perd le contrôle de son véhicule.", "http://localhost:3000/src/assets/images/items/img_detail17.png"),
("Plante Piranha", "Cette fleur se fixe temporairement à l'avant de votre véhicule. Lorsqu'elle engloutit un objet ou mord un concurrent, elle vous fait bénéficier d'une brève accélération.", "http://localhost:3000/src/assets/images/items/img_detail18.png"),
("Super klaxon", "Cet objet projette tout véhicule ou objet se trouvant à proximité, dans un vacarme assourdissant.", "http://localhost:3000/src/assets/images/items/img_detail19.png"),
("Grand 8", "Huit objets gravitent autour de votre véhicule. Appuyez sur [L] pour utiliser celui qui se trouve le plus à l'avant.", "http://localhost:3000/src/assets/images/items/img_detail20.png"),
("Pièce", "Cet objet vous octroie deux pièces lorsque vous l'utilisez. Plus vous possédez de pièces, plus votre véhicule est rapide.", "http://localhost:3000/src/assets/images/items/img_detail21.png"),
("Plume acrobate", "Cet objet permet d'effectuer un grand saut afin d'éviter bananes et carapaces, par exemple. Lors d'une bataille de ballons, percutez un adversaire en sautant pour lui voler un ballon.", "http://localhost:3000/src/assets/images/items/img_detail22.png"),
("Boo", "Cet objet vous rend temporairement intangible, empêchant les objets tels que les carapaces de vous toucher. Il se peut même que vous voliez un objet à un adversaire!", "http://localhost:3000/src/assets/images/items/img_detail23.png");