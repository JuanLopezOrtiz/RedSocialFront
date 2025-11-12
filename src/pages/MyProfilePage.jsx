import Header from "../components/Header";
import MyPublications from "../components/MyPublications";
import MyUserProfile from "../components/MyUserProfile";

export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Mi perfil</h3>
        <MyUserProfile />
        <MyPublications />
      </main>
    </>
  );
}