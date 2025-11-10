import { useParams } from "react-router-dom";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import ProfilePublications from "../components/ProfilePublications";


export default function ProfilePage() {
  const { name } = useParams();
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Perfil de {name}</h3>
        <UserProfile />
        <ProfilePublications />
      </main>
    </>
  );
}