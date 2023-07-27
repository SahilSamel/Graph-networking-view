import React, { useEffect, useState,useRef } from 'react';
import { DataSet, Network, Node, Edge } from 'vis';
import GET from "@/api/GET/GET";
// import NodeTooltip from './Tooltip';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import Sidebar from './RightSidebar';




interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const Graph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  // const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  // const [showTooltip, setShowTooltip] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedCommName, setSelectedCommName] = useState<string | null>(null);
  const [isCommunity,setIsCommunity] = useState(false);

  useEffect(() => {
    GET(`/graph/fetchGraph`,
    function (err:any, data:any){
      if(err){
        console.log(err,"Error");
      } else{
        setGraphData(data);
        setLoggedInUserId('wmuNSw3cknV1yTqjuUyxBhH9HE02');
      }
    });
  }, []);
    
  useEffect(() => {
    if (graphData && loggedInUserId) {
      const allNodes = graphData.nodes.map((node: Node) => {
        if (node.id && node.id.toString().substring(5) === loggedInUserId) {

          return { ...node, borderWidth: 5,size: 45 };
        } else {
          return node;
        }
      });

      // console.log(nodes)
  
      const data = {
        nodes: new DataSet<Node>(allNodes),
        edges: new DataSet<Edge>(graphData.edges),
      };
  
      const options = {
        physics: {
          enabled: true,
          stabilization: true,
          barnesHut: {
            gravitationalConstant: -4000,
          },
        },
        nodes:{
          shape: 'circularImage',
          size: 35,
          borderWidth: 5
        }
      };
       
      const network = new Network(containerRef.current!, data, options);

      network.focus(loggedInUserId, {
        scale: 1.5,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuart',
        },
      });
    
      network.on('click', (event) => {
        const { pointer } = event;
        const nodeId = event.nodes[0];
       
          if (nodeId) {
            
            if(nodeId[0]==='C') {
              setSelectedCommName(nodeId.toString().substring(10));
              console.log("here",nodeId.toString().substring(10));
              setIsCommunity(true);              
              }else{
              setSelectedNodeId(nodeId.toString().substring(5));
              setIsCommunity(false);
  
              }
            setShowSidebar(true);

          
        }
      }
      
      );
    }
    
  }, [graphData, loggedInUserId]);
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

    return (
    <div id="graph" style={{ height: '500px', position: 'relative' }} ref={containerRef} className='relative'>
      {showSidebar && (
        <>
          <button
            className={`toggle-button top-0 absolute p-2 rounded-full border mt-3 bg-white ${
              showSidebar ? 'right-1' : 'left-3'
            }`} // Adjusted the class based on showSidebar
            onClick={toggleSidebar}
            style={{ zIndex: 1000, }}
          >
            {showSidebar ? <IoIosArrowForward size={24} /> : <IoIosArrowBack size={24} />}
          </button>
          <Sidebar nodeid={selectedNodeId} commName={selectedCommName} isComm={isCommunity} />
        </>
      )}
    </div>
  );
};

export default Graph;
