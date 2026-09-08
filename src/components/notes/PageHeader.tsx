"use client";

interface PageHeaderProps {
  noteId: string;
  title: string;
  icon?: string;
  coverImage?: string;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string) => void;
  onCoverImageChange: (url: string) => void;
}

export function PageHeader({
  noteId,
  title,
  icon,
  coverImage,
  onTitleChange,
  onIconChange,
  onCoverImageChange,
}: PageHeaderProps) {
  return (
    <div className="w-full">
      {coverImage && (
        <div
          className="w-full h-[30vh] bg-cover bg-center mb-8"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}

      <div className="px-12 pt-8">
        <button
          onClick={() => {
            const newIcon = prompt("Enter emoji icon:", icon || "📄");
            if (newIcon) onIconChange(newIcon);
          }}
          className="text-6xl mb-4 hover:opacity-70 transition-opacity"
        >
          {icon || "📄"}
        </button>

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none text-[var(--text-main)] placeholder:text-[var(--text-faint)] mb-8"
        />
      </div>
    </div>
  );
}
