import { Camera, DoorOpen, RefreshCw, UserRoundSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../assets/images/Mario-RANK-12-02-2025.png";
import DefaultAvatar from "../assets/images/avatars/av01.png";
import ItemBox from "../assets/images/item-box.webp";
import { useAuth } from "../services/authContext";
import "../styles/Profile.css";
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DraggableItem } from "../components/DraggableItem";
import { Droppable } from "../components/Droppable";
import { toastSuccess } from "../services/toast";

export default function Profile() {
  const { user, setAuth, logout } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [goodItems, setGoodItems] = useState<Item[]>([]);
  const [mediumItems, setMediumItems] = useState<Item[]>([]);
  const [badItems, setBadItems] = useState<Item[]>([]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const mouseSensor = useSensor(MouseSensor, {
    // Nécessite un mouvement de 5px pour activer le drag
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const itemId = active.id;
    const category = over.id;

    // Find item in any of the possible locations
    const draggedItem = [
      ...items,
      ...goodItems,
      ...mediumItems,
      ...badItems,
    ].find((item) => item.id === itemId);

    if (!draggedItem) return;

    // Remove from current location
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setGoodItems((prev) => prev.filter((item) => item.id !== itemId));
    setMediumItems((prev) => prev.filter((item) => item.id !== itemId));
    setBadItems((prev) => prev.filter((item) => item.id !== itemId));

    // Add to new location
    let rankValue: number | null = null;
    switch (category) {
      case "good":
        setGoodItems((prev) => [...prev, draggedItem]);
        rankValue = 3;
        break;
      case "medium":
        setMediumItems((prev) => [...prev, draggedItem]);
        rankValue = 2;
        break;
      case "bad":
        setBadItems((prev) => [...prev, draggedItem]);
        rankValue = 1;
        break;
      case "items-to-sort":
        setItems((prev) => [...prev, draggedItem]);
        rankValue = null;
        break;
      default:
        return;
    }

    try {
      if (rankValue === null) {
        // Delete ranking
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/rankings/${user.id}/${itemId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );
      } else {
        // Update or create ranking
        await fetch(`${import.meta.env.VITE_API_URL}/api/rankings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: user.id,
            itemId: itemId,
            ranking: rankValue,
          }),
        });
      }
    } catch (error) {
      console.error("Error updating ranking:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        logout();
        navigate("/");
        toastSuccess("À bientôt pilote ! 🏁"); // Ajout du toast
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const avatars = Array.from({ length: 28 }, (_, i) => {
    const avatarSrc = new URL(
      `../assets/images/avatars/av${String(i + 1).padStart(2, "0")}.png`,
      import.meta.url,
    ).href;
    return {
      src: avatarSrc,
      alt: `Avatar ${i + 1}`,
    };
  });

  const handleAvatarChange = async (newAvatarPath: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user.id}/avatar`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profilePic: newAvatarPath }),
        },
      );

      if (response.ok) {
        setAuth({ user: { ...user, profile_pic: newAvatarPath } });
        setIsAvatarModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      alert("Erreur lors de la mise à jour de l'avatar");
    }
  };

  useEffect(() => {
    const fetchItemsAndRankings = async () => {
      try {
        // Fetch both items and rankings in parallel
        const [itemsResponse, rankingsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
            credentials: "include",
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/rankings/${user.id}`, {
            credentials: "include",
          }),
        ]);

        if (itemsResponse.ok && rankingsResponse.ok) {
          const items = await itemsResponse.json();
          const rankings: { item_id: number; ranking: number }[] =
            await rankingsResponse.json();

          // Sort items based on their rankings
          const goodItems: Item[] = [];
          const mediumItems: Item[] = [];
          const badItems: Item[] = [];
          const unrankedItems: Item[] = [];

          // First, identify all ranked items

          // Sort items into their respective categories
          for (const item of items) {
            const ranking = rankings.find((r) => r.item_id === item.id);
            if (ranking) {
              switch (ranking.ranking) {
                case 3:
                  goodItems.push(item);
                  break;
                case 2:
                  mediumItems.push(item);
                  break;
                case 1:
                  badItems.push(item);
                  break;
                default:
                  break;
              }
            } else {
              unrankedItems.push(item);
            }
          }

          // Update all states
          setGoodItems(goodItems);
          setMediumItems(mediumItems);
          setBadItems(badItems);
          setItems(unrankedItems);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) {
      fetchItemsAndRankings();
    }
  }, [user]);

  interface Item {
    id: number;
    item_image: string;
    item_name: string;
    item_description: string;
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsDescriptionModalOpen(true);
  };

  // Fonction pour réinitialiser les catégories
  const handleReset = async () => {
    try {
      // Supprimer tous les classements de l'utilisateur
      await fetch(`${import.meta.env.VITE_API_URL}/api/rankings/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Remettre tous les items dans items-to-sort
      setItems((prevItems) => [
        ...prevItems,
        ...goodItems,
        ...mediumItems,
        ...badItems,
      ]);
      setGoodItems([]);
      setMediumItems([]);
      setBadItems([]);
    } catch (error) {
      console.error("Error resetting rankings:", error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="profile-page-container">
        <div className="profile-header">
          <img src={Title} alt="titre" className="title-img-profile" />
          <div className="header-icons">
            <UserRoundSearch
              className="ranking-icon"
              size={36}
              onClick={() => navigate("/ranking")}
            />
            <DoorOpen
              className="logout-icon"
              size={36}
              onClick={handleLogout}
            />
          </div>
        </div>
        <div className="avatar-container">
          <div className="avatar-wrapper">
            <img
              className="user-profile-pic"
              src={user.profile_pic}
              alt="Avatar"
              onError={(e) => {
                e.currentTarget.src = DefaultAvatar;
              }}
            />
            <Camera
              size={24}
              onClick={() => setIsAvatarModalOpen(true)}
              className="camera-icon"
            />
          </div>
          <p className="user-welcome-text">Itseu me, {user.username}!</p>
          <div className="profile-divider"> </div>
        </div>
        <div className="profile-ranking-container">
          <div className="profile-ranking-title">
            <img src={ItemBox} alt="item box" className="item-box-image" />
            <h2>Classe les items</h2>
            <RefreshCw size={36} onClick={handleReset} className="reset-icon" />
          </div>

          <div className="ranking-categories">
            <Droppable id="good">
              <div className="category good">
                <h3>Wooow</h3>
                <div className="items-container">
                  {goodItems.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      onInfoClick={() => handleItemClick(item)}
                      imageSrc={item.item_image}
                      altText={item.item_name}
                      showOnlyImage={true}
                    >
                      <p>{item.item_name}</p>
                    </DraggableItem>
                  ))}
                </div>
              </div>
            </Droppable>

            <Droppable id="medium">
              <div className="category medium">
                <h3>Mouais</h3>
                <div className="items-container">
                  {mediumItems.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      onInfoClick={() => handleItemClick(item)}
                      imageSrc={item.item_image}
                      altText={item.item_name}
                      showOnlyImage={true}
                    >
                      <p>{item.item_name}</p>
                    </DraggableItem>
                  ))}
                </div>
              </div>
            </Droppable>

            <Droppable id="bad">
              <div className="category bad">
                <h3>Beurk</h3>
                <div className="items-container">
                  {badItems.map((item) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      onInfoClick={() => handleItemClick(item)}
                      imageSrc={item.item_image}
                      altText={item.item_name}
                      showOnlyImage={true}
                    >
                      <p>{item.item_name}</p>
                    </DraggableItem>
                  ))}
                </div>
              </div>
            </Droppable>
          </div>

          <Droppable id="items-to-sort">
            <div className="items-to-sort">
              {items.map((item) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  onInfoClick={() => handleItemClick(item)}
                  imageSrc={item.item_image}
                  altText={item.item_name}
                  showOnlyImage={false}
                >
                  <p>{item.item_name}</p>
                </DraggableItem>
              ))}
            </div>
          </Droppable>
        </div>

        {isDescriptionModalOpen && selectedItem && (
          <div className="description-modal">
            <div className="description-modal-content">
              <button
                type="button"
                className="close-button"
                onClick={() => setIsDescriptionModalOpen(false)}
              >
                X
              </button>
              <div className="item-details">
                <img
                  src={selectedItem.item_image}
                  alt={selectedItem.item_name}
                  className="item-detail-image"
                />
                <h3>{selectedItem.item_name}</h3>
                <p>{selectedItem.item_description}</p>
              </div>
            </div>
          </div>
        )}

        {isAvatarModalOpen && (
          <div className="avatar-modal">
            <div className="avatar-modal-content">
              <button
                type="button"
                className="close-button"
                onClick={() => setIsAvatarModalOpen(false)}
                onKeyDown={() => setIsAvatarModalOpen(false)}
              >
                X
              </button>
              <h2>Choisir un avatar</h2>
              <div className="avatar-grid">
                {avatars.map((avatar) => (
                  <img
                    key={avatar.src}
                    src={avatar.src}
                    alt={avatar.alt}
                    onClick={() => handleAvatarChange(avatar.src)}
                    onKeyDown={() => handleAvatarChange(avatar.src)}
                    className="avatar-option"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
