import React, { useEffect, useState } from 'react';
import { DataSet, Network, Node, Edge } from 'vis';
import GET from "@/api/GET/GET";

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const Graph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

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
      const container = document.getElementById('graph');
      const nodes = graphData.nodes.map((node: Node) => {
        if (node.id === loggedInUserId) {
          return { ...node, color: '#FF0000', borderWidth: 3 };
        } else {
          return node;
        }
      });

      console.log(nodes)
  
      const data = {
        nodes: new DataSet<Node>(nodes),
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
      };
  
      const network = new Network(container!, data, options);
  
      network.focus(loggedInUserId, {
        scale: 1.5,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuart',
        },
      });
    }
  }, [graphData, loggedInUserId]);

  return <div id="graph" style={{ height: '500px' }} />;
};

export default Graph;
