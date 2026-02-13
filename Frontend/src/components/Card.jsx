export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm p-5 ${className}`}
    >
      {title && (
        <h2 className="text-textPrimary text-sm font-medium mb-3">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
