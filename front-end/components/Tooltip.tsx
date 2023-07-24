import React from 'react';

interface NodeTooltipProps {
  x: number;
  y: number;
}

interface NodeData {
  id: string;
  name: string;
  bio: string;
  // Add other properties related to the node that you want to display in the tooltip
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({ x, y}) => {
  return (
    <div
    className="tooltip"
    style={{
        position: 'absolute',
        left: x, // Use the DOM x-coordinate directly
        top: y, // Use the DOM y-coordinate directly
        backgroundColor: '#100d0d',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        zIndex: 9999999, // Set a higher zIndex to make sure the tooltip is on top
      }}
  >
      <div className="text-lg font-semibold">hii i am your friend</div>
      {/* Display other properties here */}
    </div>
  );
};

export default NodeTooltip;
