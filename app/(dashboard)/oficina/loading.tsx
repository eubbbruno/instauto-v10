export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#1e3a8a]/20 border-t-[#1e3a8a] rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 mt-4 font-medium">Carregando sua oficina...</p>
      </div>
    </div>
  );
}
