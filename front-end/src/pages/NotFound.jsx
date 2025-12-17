import { useNavigate } from "react-router";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-6xl font-extrabold text-gray-800 mb-4 md:text-8xl">
                404 NOT FOUND
            </h1>

            <p className="text-xl text-gray-600 mb-8">
                You can navigate back and try another page.
            </p>
            <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-yellow text-mint font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out
                border border-transparent hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
                Back
            </button>
        </div>
    );
}

export default NotFound;