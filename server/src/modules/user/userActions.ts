import argon2 from "argon2";
import type { RequestHandler } from "express";
import userRepository from "./userRepository";

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!email?.trim() || !username?.trim() || !password) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Le format d'email n'est pas valide" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
      return;
    }

    const existingEmail = await userRepository.readByEmail(email);
    if (existingEmail) {
      res.status(400).json({ error: "Cet adresse email est déjà utilisé" });
      return;
    }

    const existingUsername = await userRepository.readByUsername(username);
    if (existingUsername) {
      res.status(400).json({ error: "Ce pseudo n'est pas disponible" });
      return;
    }
    const hashedPassword = await argon2.hash(password, hashingOptions);

    const userId = await userRepository.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      profile_pic: "/assets/images/avatars/av01.png",
    });

    res.status(201).json({
      message: "Bienvenue ! Votre compte a été créé avec succès",
      userId,
    });
  } catch (err) {
    console.error("Error in user registration:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
    next(err);
  }
};

const updateAvatar: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { profilePic } = req.body;

    await userRepository.updateAvatar(Number(id), profilePic);

    res.status(200).json({ message: "Avatar mis à jour avec succès" });
  } catch (err) {
    console.error("Error updating avatar:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'avatar" });
  }
};

const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await userRepository.readAll();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export default { add, updateAvatar, getAllUsers };
