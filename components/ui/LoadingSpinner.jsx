export default function LoadingSpinner({ size = "md", color = "amber" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const colorClasses = {
    amber: "border-amber-500",
    blue: "border-blue-500",
    gray: "border-gray-500",
    white: "border-white",
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200 ${colorClasses[color]} border-t-transparent`}
        ></div>
        <div
          className={`${sizeClasses[size]} animate-ping rounded-full border-2 ${colorClasses[color]} opacity-20 absolute inset-0`}
        ></div>
      </div>
    </div>
  )
}
