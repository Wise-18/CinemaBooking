import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const API_KEY = '1038515-mystuden-A760F76B'; // Your TasteDive API key

const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [query, setQuery] = useState('movies'); // Default search term

    // Function to fetch movie recommendations from TasteDive API
    const fetchRecommendations = async () => {
        try {
            const response = await axios.get('https://tastedive.com/api/similar', {
                params: {
                    q: query,
                    type: 'movies',
                    k: API_KEY
                }
            });

            setRecommendations(response.data.Similar.Results);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, [query]);

    return (
        <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
            <Navbar />
            <div className="mx-4 mt-8 p-6 bg-white rounded-lg shadow-md w-full max-w-2xl self-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Movie Recommendations</h2>
                <div className="flex flex-col items-center mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a movie or topic"
                        className="w-full max-w-lg p-2 mb-4 border border-gray-300 rounded-lg text-gray-900"
                    />
                    <button
                        onClick={fetchRecommendations}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Get Recommendations
                    </button>
                </div>
                {recommendations.length > 0 && (
                    <div className="recommendations p-4 bg-white rounded-lg shadow-md w-full">
                        <h3 className="text-xl font-bold mb-4">Recommended Movies:</h3>
                        <ul className="list-disc list-inside">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="text-lg">
                                    {rec.Name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* Button to navigate to the recommendations page */}
            <div className="mt-6 flex justify-center">
                <Link to="/recommendations" className="bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-800 transition">
                    Go to Recommendations Page
                </Link>
            </div>
        </div>
    );
};

export default RecommendationsPage;
