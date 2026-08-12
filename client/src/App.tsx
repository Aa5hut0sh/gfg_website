import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import { Navigate } from "react-router-dom";
import Home from "./pages/home";
import Team from "./pages/teams";
import Resources from "./pages/resources";
import Navbar from "./components/Navbar";
import ContactUs from "./pages/contact.";
import ApplicationPage from "./pages/ApplicationPage";
import EventPage from "./pages/EventPage";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EventResponses from "./pages/EventResponses";
import { useAuth } from "./auth/authContext";
import Background from "./components/GlowBlob";
import Lauch from "./pages/lauch";
import ProfilesPage from "./pages/PlatformPage";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/home" />;

  return <>{children}</>;
};

const App = () => {
  return (
    <div className="relative min-h-screen text-white selection:bg-green-500/30">
      <Background />
      <BrowserRouter>
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/codefolio" element={<ProfilesPage />} />
             

            <Route
              path="/events/create"
              element={
                <ProtectedRoute adminOnly>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/responses/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EventResponses />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
