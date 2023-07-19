import { useRouter } from "next/router";
import Graph from "@/components/Graph.tsx";
import Message from "@/components/Message.tsx"

const Home = () => {
    const router = useRouter();

    return(
        <>
            <Graph />
            <Message />
        </>
    );
}

export default Home;