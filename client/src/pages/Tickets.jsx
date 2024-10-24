import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const Tickets = () => {
	const { auth } = useContext(AuthContext)
	const [tickets, setTickets] = useState([])
	const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false)
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

	const fetchTickets = async () => {
		try {
			setIsFetchingticketsDone(false)
			const response = await axios.get('/auth/tickets', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			setTickets(
				response.data.data.tickets?.sort((a, b) => {
					if (a.showtime.showtime > b.showtime.showtime) {
						return 1
					}
					return -1
				})
			)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingticketsDone(true)
		}
	}

	useEffect(() => {
		fetchTickets()
	}, [])

	const formatDate = (date, timeZone) => {
		const options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZone: timeZone,
			timeZoneName: 'short'
		}
		return new Intl.DateTimeFormat('en-US', options).format(date)
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">My Tickets</h2>
				{isFetchingticketsDone ? (
					<>
						{tickets.length === 0 ? (
							<p className="text-center">You have not purchased any tickets yet</p>
						) : (
							<div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
								{tickets.map((ticket, index) => {
									return (
										<div className="flex flex-col" key={index}>
											<ShowtimeDetails showtime={ticket.showtime} />
											<div className="flex h-full flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
												<div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
													<p className="whitespace-nowrap font-semibold">Seats : </p>
													<p className="text-left">
														{ticket.seats.map((seat) => seat.row + seat.number).join(', ')}
													</p>
													<p className="whitespace-nowrap">({ticket.seats.length} seats)</p>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</>
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
			</div>
		</div>
	)
}

export default Tickets
