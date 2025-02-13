import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: number;
  onInfoClick: () => void;
  imageSrc: string;
  altText: string;
  children: React.ReactNode;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  onInfoClick,
  imageSrc,
  altText,
  children,
}) => {
  // Sans activationConstraint ici
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  // Pour bloquer le clic complet sur la carte (si souhaité)
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Pour empêcher le drag si on clique sur l'icône
  const handleIconMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-card"
      onClick={handleCardClick} // Empêche le clic sur la carte
    >
      <img src={imageSrc} alt={altText} draggable={false} />
      {children}
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
