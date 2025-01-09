import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
}

const HomePage = () => {
  const { userName, isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: Event[]) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events", err));
  }, []);

  const eventsForDate = events.filter(
    (event) =>
      new Date(event.date).toDateString() === selectedDate?.toDateString()
  );

  const handleEventCreateButton = () => {
    navigate(`/event/create`);
  };

  // Function to check if a date has events
  const isDateWithEvents = (date: Date) =>
    events.some(
      (event) => new Date(event.date).toDateString() === date.toDateString()
    );

  // Handle event deletion
  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }

      // Update the events state after successful deletion
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event. Please try again.");
    }
  };

  return (
    <div className="flex w-full h-full p-10 justify-center">
      <div className="flex flex-col justify-center items-center w-full max-w-[1840px] gap-8">
        <h1 className="text-3xl">Hi {userName}!</h1>
        {isAdmin && (
          <Button onClick={handleEventCreateButton}>Create New</Button>
        )}
        <div className="flex flex-col items-center gap-8">
          {/* Calendar */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded border border-sky-500 shadow"
            // Highlight days with events
            modifiers={{
              highlighted: (date) => isDateWithEvents(date),
            }}
            modifiersClassNames={{
              highlighted: "text-sky-500",
            }}
          />
          <div className="flex flex-col gap-2 max-w-[300px]">
            {eventsForDate.length ? (
              eventsForDate.map((event) => (
                <div
                  key={event.id}
                  className="border border-sky-500 p-4 rounded flex flex-col gap-4 relative"
                >
                  <h3 className="font-medium break-words">{event.title}</h3>
                  <div>
                    <p className="break-words">{event.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      aria-label="Delete event"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No events for this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
