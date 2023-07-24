import React, { useEffect, useState,useRef } from 'react';
import { DataSet, Network, Node, Edge } from 'vis';
import GET from "@/api/GET/GET";
// import NodeTooltip from './Tooltip';
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
      
      // network.on('hoverNode', (event: any) => {
      //   const { pointer } = event;
      //   const { x, y } = pointer.canvas;

      //   const nodeId = data.nodes.get(event.node);
      //   console.log(nodeId);
      //   const node = graphData.nodes.find((node) => node.id === nodeId);
      //   if (node) {
      //     setTooltipPosition({ x, y });
      //     setShowTooltip(true);
      //   }
      // });

      // network.on('blurNode', () => {
      //   setShowTooltip(false);
      // });

      network.focus(loggedInUserId, {
        scale: 1.5,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuart',
        },
      });
      // network.on('click', (event) => {
      //   const { pointer } = event;
      //   const nodeId = event.nodes[0];
      //   console.log(nodeId);
      //   const { x, y } = pointer.DOM;
      //   console.log(event);
      //   console.log(x,y,typeof(x),typeof(y))
      //   if (nodeId) {
      //     const node = graphData.nodes.find((node) => node.id === nodeId);
      //     if (node) {
      //       setTooltipPosition( {x, y});
      //       setShowTooltip(true);
      //     }
      //   }
      // });
      network.on('click', (event) => {
        const { pointer } = event;
        const nodeId = event.nodes[0];
       
          if (nodeId) {
            setShowSidebar(true);
            setSelectedNodeId(nodeId.toString().substring(5));
            console.log(selectedNodeId);
          
        }
      }
      );
    }
    
  }, [graphData, loggedInUserId]);
  const nodeToShowTooltip = graphData?.nodes.find((node) => node.id === loggedInUserId);

  return(
    <div id="graph" style={{ height: '500px' }} ref={containerRef}>
      {/* {showTooltip && graphData && loggedInUserId && 
      (
         <NodeTooltip
         x={tooltipPosition.x}
         y={tooltipPosition.y}
         
       />
     )
     } */}
     {showSidebar && (
        <Sidebar nodeid={selectedNodeId} />
      )}
     </div>
  ) 
};

export default Graph;
