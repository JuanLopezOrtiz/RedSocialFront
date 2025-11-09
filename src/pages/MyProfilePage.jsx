import Header from "../components/Header";
import MyPublications from "../components/MyPublications";

export default function MyProfilePage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h3>Mi perfil</h3>
        <MyPublications />
      </main>
    </>
  );
}