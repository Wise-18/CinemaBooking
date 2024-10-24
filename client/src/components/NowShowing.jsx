import 'react-toastify/dist/ReactToastify.css'
import Loading from './Loading'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
	const [userTimeZone, setUserTimeZone] = useState('UTC')
	const [currentTime, setCurrentTime] = useState(new Date())

	useEffect(() => {
		// Determine user's time zone
		try {
			const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (timeZone) {
				setUserTimeZone(timeZone);
			}
		} catch (error) {
			console.error('Failed to determine user time zone, defaulting to UTC:', error);
		}
	}, [])

	useEffect(() => {
		// Update the current time every second
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, [])

	// Function to format date in the specified time zone
	const formatDate = (dateString, timeZone) => {
		if (!dateString || isNaN(new Date(dateString))) {
			return 'N/A';
		}
		const options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZone: timeZone || 'UTC',
			timeZoneName: 'short'
		}
		return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString))
	}

	// Debugging: log movies and other props to see if they are being received correctly
	console.log('Movies:', movies);
	console.log('Is Fetching Movies Done:', isFetchingMoviesDone);
	console.log('User Time Zone:', userTimeZone);

	return (
		<div className="mx-4 flex flex-col rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
			<h2 className="text-3xl font-bold">Now Showing</h2>
			{isFetchingMoviesDone ? (
				movies && movies.length > 0 ? (
					<div className="mt-1 overflow-x-auto sm:mt-3">
						<div className="mx-auto flex w-fit gap-4">
							{movies?.map((movie, index) => {
								return movies[selectedMovieIndex]?._id === movie._id ? (
									<div
										key={index}
										title={movie.name}
										className="flex w-[108px] flex-col rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 p-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 sm:w-[144px]"
										onClick={() => {
											setSelectedMovieIndex(null)
											sessionStorage.setItem('selectedMovieIndex', null)
										}}
									>
										<img
											src={movie.img}
											alt={movie.name}
											className="h-36 rounded-md object-cover drop-shadow-md sm:h-48"
										/>
										<p className="truncate pt-1 text-center text-sm font-semibold leading-4">
											{movie.name}
										</p>
										<p className="pt-1 text-center text-xs">
											Added Date (Local): {formatDate(movie.createdAt, userTimeZone)}
										</p>
										<p className="text-center text-xs">
											Added Date (UTC): {formatDate(movie.createdAt, 'UTC')}
										</p>
									</div>
								) : (
									<div
										key={index}
										className="flex w-[108px] flex-col rounded-md bg-white p-1 drop-shadow-md hover:bg-gradient-to-br hover:from-indigo-500 hover:to-blue-400 hover:text-white sm:w-[144px]"
										onClick={() => {
											setSelectedMovieIndex(index)
											sessionStorage.setItem('selectedMovieIndex', index)
										}}
									>
										<img
											src={movie.img}
											alt={movie.name}
											className="h-36 rounded-md object-cover drop-shadow-md sm:h-48"
										/>
										<p className="truncate pt-1 text-center text-sm font-semibold leading-4">
											{movie.name}
										</p>
										<p className="pt-1 text-center text-xs">
											Added Date (Local): {formatDate(movie.createdAt, userTimeZone)}
										</p>
										<p className="text-center text-xs">
											Added Date (UTC): {formatDate(movie.createdAt, 'UTC')}
										</p>
									</div>
								)
							})}
						</div>
					</div>
				) : (
					<p className="mt-4 text-center">There are no movies available</p>
				)
			) : (
				<Loading />
			)}
			<footer className="mt-4 text-center text-xs text-gray-700">
				Current User Time Zone: {userTimeZone || 'UTC'}
				<br />
				Current Date and Time (Local): {formatDate(currentTime, userTimeZone)}
				<br />
				Current Date and Time (UTC): {formatDate(currentTime, 'UTC')}
			</footer>
			<div className="mt-4 text-center">
				<Link to="/quotes">
					<button className="mt-4 w-full rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 py-2 px-4 font-medium text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
						Go to Quotes and Currency Page
					</button>
				</Link>
			</div>
		</div>
	)
}

export default NowShowing
