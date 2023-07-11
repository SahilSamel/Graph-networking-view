import { useRouter } from "next/router";
import Graph from "@/components/Graph.tsx";

const Home = () => {
    const router = useRouter();

    return(
        <>
            <Graph />
        </>
    );
}

export default Home;