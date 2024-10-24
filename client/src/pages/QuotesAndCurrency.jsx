import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QuotesPage = () => {
    const [quote, setQuote] = useState('');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [loadingQuote, setLoadingQuote] = useState(true);
    const [loadingExchangeRate, setLoadingExchangeRate] = useState(true);


    const fetchQuote = async () => {
        setLoadingQuote(true);
        try {
            const response = await axios.get('http://localhost:8080/api/quote');
            setQuote(response.data);
        } catch (error) {
            console.error('Error fetching quote:', error);
        } finally {
            setLoadingQuote(false);
        }
    };

    // Fetch exchange rate data from a different API
    const fetchExchangeRate = async () => {
        setLoadingExchangeRate(true);
        try {
            const response = await axios.get('http://localhost:8080/api/exchange-rate');
            setExchangeRate(response.data);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        } finally {
            setLoadingExchangeRate(false);
        }
    };

    useEffect(() => {
        fetchQuote();
        fetchExchangeRate();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 to-blue-500 text-gray-100 p-8">
            <Navbar />
            <div className="container mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg text-gray-900">
                <h2 className="text-3xl font-bold mb-4">Quotes and Currency Exchange Page</h2>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Random Quote:</h3>
                    {loadingQuote ? (
                        <p>Loading quote...</p>
                    ) : (
                        <p className="mt-2 italic">"{quote.content}" - {quote.author}</p>
                    )}
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Exchange Rate (USD to EUR):</h3>
                    {loadingExchangeRate ? (
                        <p>Loading exchange rate...</p>
                    ) : (
                        <p className="mt-2">1 USD = {exchangeRate?.rates?.EUR || 'N/A'} EUR</p>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={async () => {
                            await fetchQuote();
                            await fetchExchangeRate();
                        }}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition mb-4"
                    >
                        Refresh Quote and Exchange Rate
                    </button>
                    <Link to="/">
                        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuotesPage;
