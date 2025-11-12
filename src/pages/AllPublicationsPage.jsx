import CreatePublication from "../components/CreatePublication";
import Header from "../components/Header";
import PublicationList from "../components/PublicationList";

export default function AllPublicationsPage() {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <CreatePublication />
        <h3>Todas las publicaciones</h3>
        <p>Aquí verás las publicaciones de todos los usuarios.</p>
        <PublicationList />
      </main>
    </>
  );
}
