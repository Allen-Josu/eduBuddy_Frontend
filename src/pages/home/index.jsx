import Header from "../../components/Header";
import HomeDashboard from "../../components/Dashboard";

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-[#27272a] h-screen w-full">
        <HomeDashboard />
      </div>
    </>
  );
}
