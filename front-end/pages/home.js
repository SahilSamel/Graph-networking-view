import { useRouter } from "next/router";
import Graph from "@/components/Graph.tsx";
import Chat from "@/components/Chat";

const Home = () => {
    const router = useRouter();

    return(
        <>
            <Graph />
            {/* node={nodeToShowTooltip} */}
        </>
    );
}

export default Home;