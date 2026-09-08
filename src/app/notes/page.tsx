export default function NotesPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-6 opacity-80">📝</div>
        <h1 className="type-heading-2 text-[var(--text-main)] mb-3">
          Your Private Workspace
        </h1>
        <p className="type-body text-[var(--text-muted)] text-pretty leading-relaxed mb-8">
          A beautifully minimal space for thoughts, projects, and ideas. Select a page from the sidebar to start writing, or create a new one.
        </p>
      </div>
    </div>
  );
}
