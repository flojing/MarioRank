import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: number;
  onInfoClick: () => void;
  imageSrc: string;
  altText: string;
  children: React.ReactNode;
  showOnlyImage?: boolean; // nouveau prop
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  onInfoClick,
  imageSrc,
  altText,
  children,
  showOnlyImage = false,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  // Bloque le clic sur la carte
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Stoppe le drag si on clique sur l'icône
  const handleIconMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={
        showOnlyImage
          ? "draggable-card card-small" // classe spéciale si on veut un style différent
          : "draggable-card"
      }
      onClick={handleCardClick}
    >
      <img src={imageSrc} alt={altText} draggable={false} />

      {!showOnlyImage && children}

      <span
        className="info-icon"
        onMouseDown={handleIconMouseDown}
        onClick={onInfoClick}
        onKeyDown={onInfoClick}
      >
        ℹ
      </span>
    </div>
  );
};
