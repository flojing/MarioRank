import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../assets/images/Mario-RANK-12-02-2025.png";
import Mario from "../assets/images/Mario.png";
import BlueButton from "../assets/images/blue-button.png";
import { useAuth } from "../services/authContext";
import "../styles/Home.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: registerData.pseudo,
            email: registerData.email,
            password: registerData.password,
          }),
        },
      );

      if (response.ok) {
        alert("Inscription réussie !");
        setRegisterData({
          pseudo: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        window.scrollTo(0, 0);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Erreur lors de l'inscription");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        login(data.user);
        navigate("/profile");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <>
      <img src={Title} alt="titre" className="title-img" />
      <img src={Mario} alt="Mario" className="mario-img" />
      <p className="home-welcome-text">
        Connectez-vous pour classer les items de Mario Kart selon vos goûts
        personnels et consulter les préférences des autres pilotes !
      </p>
      <div className="button-wrapper">
        <div
          className="home-login-button-container"
          onClick={openModal}
          onKeyDown={openModal}
        >
          <img src={BlueButton} alt="Bouton bleu" className="blue-button" />
          <p className="home-login-button-text">Letseu go!</p>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={closeModal}
              onKeyDown={closeModal}
            >
              X
            </span>
            <h2>S'identifier</h2>
            <form className="modal-login-form" onSubmit={handleLogin}>
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
                onChange={handleLoginChange}
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                onChange={handleLoginChange}
              />
              <button type="submit">Se connecter</button>
            </form>
            <div className="login-divider"> </div>
            <h2>S'enregistrer</h2>
            <form className="modal-login-form" onSubmit={handleRegister}>
              <label htmlFor="pseudo">Pseudo</label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                placeholder="Entrez votre pseudo"
                value={registerData.pseudo}
                onChange={handleRegisterChange}
              />
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
                value={registerData.email}
                onChange={handleRegisterChange}
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
              />
              <button type="submit">Valider</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
