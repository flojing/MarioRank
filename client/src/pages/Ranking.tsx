import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "../assets/images/avatars/av01.png";
import { useAuth } from "../services/authContext";
import "../styles/Ranking.css";

interface User {
  id: number;
  username: string;
  email: string;
  profile_pic: string;
}

interface Item {
  id: number;
  item_image: string;
  item_name: string;
  item_description: string;
  ranking: number;
}

export default function Ranking() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserItems, setSelectedUserItems] = useState<Item[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data.filter((u: User) => u.id !== user?.id));
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);

    try {
      const rankingsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rankings/${user.id}`,
        {
          credentials: "include",
        },
      );

      if (rankingsResponse.ok) {
        const rankingsData = await rankingsResponse.json();

        const itemsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/items`,
          {
            credentials: "include",
          },
        );

        if (itemsResponse.ok) {
          const items = await itemsResponse.json();

          const completeItems = rankingsData.map(
            (ranking: { item_id: number; ranking: number }) => {
              const item = items.find(
                (item: Item) => item.id === ranking.item_id,
              );
              return {
                ...item,
                ranking: ranking.ranking,
              };
            },
          );

          setSelectedUserItems(completeItems);
        }
      } else {
        console.error("Failed to fetch user rankings");
      }
    } catch (error) {
      console.error("Error fetching user rankings:", error);
    }
  };

  const closeModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
    setSelectedUserItems([]);
  };

  return (
    <div className="ranking-page-container">
      <div className="ranking-page-header">
        <ArrowLeft
          className="ranking-back-icon"
          size={36}
          onClick={() => navigate("/profile")}
        />
      </div>
      <div className="ranking-users-list">
        {users.map((user) => (
          <div
            key={user.id}
            className="ranking-user-card"
            onClick={() => handleUserClick(user)}
            onKeyDown={() => handleUserClick(user)}
          >
            <img
              src={user.profile_pic}
              alt={user.username}
              onError={(e) => {
                e.currentTarget.src = DefaultAvatar;
              }}
            />
            <p>{user.username}</p>
          </div>
        ))}
      </div>

      {isUserModalOpen && selectedUser && (
        <div className="ranking-user-modal">
          <div className="ranking-modal-content">
            <button
              type="button"
              className="ranking-close-button"
              onClick={closeModal}
            >
              X
            </button>
            <h2>Préférences de {selectedUser.username}</h2>
            <div className="ranking-grid">
              <div className="ranking-category ranking-good">
                <h3>Wooow</h3>
                <div className="ranking-items-container">
                  {selectedUserItems
                    .filter((item) => item.ranking === 3)
                    .map((item) => (
                      <div key={item.id} className="ranking-item-card">
                        <img src={item.item_image} alt={item.item_name} />
                      </div>
                    ))}
                </div>
              </div>

              <div className="ranking-category ranking-medium">
                <h3>Mouais</h3>
                <div className="ranking-items-container">
                  {selectedUserItems
                    .filter((item) => item.ranking === 2)
                    .map((item) => (
                      <div key={item.id} className="ranking-item-card">
                        <img src={item.item_image} alt={item.item_name} />
                      </div>
                    ))}
                </div>
              </div>

              <div className="ranking-category ranking-bad">
                <h3>Beurk</h3>
                <div className="ranking-items-container">
                  {selectedUserItems
                    .filter((item) => item.ranking === 1)
                    .map((item) => (
                      <div key={item.id} className="ranking-item-card">
                        <img src={item.item_image} alt={item.item_name} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
