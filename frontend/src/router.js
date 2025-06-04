import { createBrowserRouter } from "react-router-dom";
import Aboutus from "./components/Aboutus";
import Home from "./components/Home"
import Login from "./components/user/Login"
import Logout from "./components/user/Logout";
import ConcertDetail from "./components/Concert";
import DashboardOverview from "./components/admin/Adminpanel";
import ConcertManagement from "./components/admin/ViewConcerts";
import AddConcert from "./components/admin/AddConcert";
import Updateconcert from "./components/admin/UpdateConcert";
import ViewUsers from "./components/admin/ViewUsers";
import ConcertBooking from "./components/user/ConcertBooking";
import BookingConfirmation from "./components/user/BookingConfirmation";
import ShowBookings from "./components/user/ShowBookings";
import UserBookings from "./components/admin/UserBookings";
import AllBookings from "./components/admin/AllBookings";

const router = createBrowserRouter([
    { path: '', element: <Home/> },
    { path: 'aboutus', element: <Aboutus/> },
    { path: '/authentication', element: <Login/>},
    { path: '/logout', element: <Logout/>},
    { path: '/concert/:concertId', element: <ConcertDetail/> },
    { path: '/dashboard', element: <DashboardOverview/> },
    { path: '/admin/concerts', element: <ConcertManagement/> },
    { path: '/admin/addconcert', element: <AddConcert/> },
    { path: '/admin/updateconcert/:concertId', element: <Updateconcert/> },
    { path: '/admin/viewusers', element: <ViewUsers/> },
    { path: '/concertbooking/:concertId', element: <ConcertBooking/>},
    { path: '/bookingconfirmation/:bookingId', element: <BookingConfirmation/>},
    { path: '/showbookings', element: <ShowBookings/>},
    { path: '/admin/:userId/userbookings', element: <UserBookings/>},
    { path: '/admin/allbookings', element: <AllBookings/> },
]);

export default router;