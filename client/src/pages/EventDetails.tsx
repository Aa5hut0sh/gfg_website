import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import { getEventById, getMyRegistration } from "../services/event.service";
import { Event } from "../types/event.types";
import RegistrationForm from "../components/RegistrationForm";
import UserEventStatus from "../components/UserEventStatus";
import AdminEventDashboard from "../components/AdminEventDashboard";
import EventInfoOnly from "../components/EventInfoOnly";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const eventRes = await getEventById(id);
        setEvent(eventRes.event);
        if (user) {
          const regRes = await getMyRegistration(id);
          setRegistration(regRes.registration);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  if (loading)
    return <div className="text-white p-20 text-center">Loading...</div>;
  if (!event)
    return <div className="text-white p-20 text-center">Event not found</div>;

  const isDeadlinePassed = event.deadline
    ? new Date(event.deadline).getTime() < Date.now()
    : false;


  if (user?.role === "ADMIN") {
    return (
      <div className="max-w-5xl mx-auto py-24 px-6">
        <AdminEventDashboard event={event} refreshEvent={() => window.location.reload()} />
      </div>
    );
  }

  // 1. Check Deadline FIRST - If it's over, it's over for everyone
  if (isDeadlinePassed) {
    return (
      <div className="py-24 px-6">
        <EventInfoOnly event={event} message="Registration Closed" />
      </div>
    );
  }

  // 2. Check if the event is even public yet
  if (!event.isActive) {
    return (
      <div className="py-24 px-6">
        <EventInfoOnly event={event} message="Coming Soon" />
      </div>
    );
  }

  // 3. Check Registration for logged-in users
  if (user && registration) {
    return (
      <div className="py-24 px-6">
        <UserEventStatus event={event} registration={registration} />
      </div>
    );
  }

  // 4. Check Auth - If not logged in, show info only with login prompt
  if (!user) {
    return (
      <div className="py-24 px-6">
        <EventInfoOnly
          event={event}
          message="Registration Open"
          showLoginPrompt={true} 
        />
      </div>
    );
  }

  // 5. If they passed all guards, they are logged in and can apply
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <RegistrationForm
        event={event}
        onSuccessfulSubmit={() => window.location.reload()}
      />
    </div>
  );
};

export default EventDetails;
