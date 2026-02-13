export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 mt-4 font-medium">Carregando sua oficina...</p>
      </div>
    </div>
  );
}
