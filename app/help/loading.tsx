export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] animate-pulse">
      <div className="bg-[#282828] py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-[#1A1A1A] rounded-md w-1/2 mx-auto mb-8"></div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-12 bg-[#1A1A1A] rounded-lg w-full"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <div className="h-10 bg-[#1A1A1A] rounded-full w-32"></div>
            <div className="h-10 bg-[#1A1A1A] rounded-full w-24"></div>
            <div className="h-10 bg-[#1A1A1A] rounded-full w-36"></div>
            <div className="h-10 bg-[#1A1A1A] rounded-full w-28"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="space-y-2">
              <div className="h-10 bg-[#282828] rounded-md w-full"></div>
              <div className="h-10 bg-[#282828] rounded-md w-full"></div>
              <div className="h-10 bg-[#282828] rounded-md w-full"></div>
              <div className="h-10 bg-[#282828] rounded-md w-full"></div>
              <div className="h-10 bg-[#282828] rounded-md w-full"></div>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="h-8 bg-[#282828] rounded-md w-1/3 mb-6"></div>

            <div className="space-y-4 mb-12">
              <div className="h-16 bg-[#282828] rounded-lg w-full"></div>
              <div className="h-16 bg-[#282828] rounded-lg w-full"></div>
              <div className="h-16 bg-[#282828] rounded-lg w-full"></div>
            </div>

            <div className="h-8 bg-[#282828] rounded-md w-1/3 mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-48 bg-[#282828] rounded-lg"></div>
              <div className="h-48 bg-[#282828] rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
