import { useState } from "react";
import Title from "../assets/images/Mario-RANK-12-02-2025.png";
import Mario from "../assets/images/Mario.png";
import BlueButton from "../assets/images/blue-button.png";
import "../styles/Home.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <img src={Title} alt="titre" className="title-img" />
      <img src={Mario} alt="Mario" className="mario-img" />
      <p className="home-welcome-text">
        Connectez-vous pour classer les items de Mario Kart selon vos goûts
        personnels et consulter les préférences des autres utilisateurs.
      </p>
      <div className="button-wrapper">
        <div
          className="home-login-button-container"
          onClick={openModal}
          onKeyDown={openModal}
        >
          <img src={BlueButton} alt="Bouton bleu" className="blue-button" />
          <p className="home-login-button-text">Connexion</p>
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
            <form className="modal-login-form">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
              />
              <button type="submit">Se connecter</button>
            </form>
            <div className="login-divider"> </div>
            <h2>S'enregistrer</h2>
            <form className="modal-login-form">
              <label htmlFor="pseudo">Pseudo</label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                placeholder="Entrez votre pseudo"
              />
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
              />
              <label htmlFor="">Confirmer le mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Confirmez votre mot de passe"
              />
              <button type="submit">Valider</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
