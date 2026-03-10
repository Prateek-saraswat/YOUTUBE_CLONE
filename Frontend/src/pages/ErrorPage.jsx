export default function ErrorPage() {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-5xl font-bold text-gray-700">404</h1>
        <p className="text-gray-500 mt-2">Page not found</p>
  
        <a
          href="/"
          className="mt-6 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Home
        </a>
      </div>
    );
  }