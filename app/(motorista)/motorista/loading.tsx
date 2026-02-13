export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-blue-50/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 mt-4 font-medium">Carregando seu dashboard...</p>
      </div>
    </div>
  );
}
