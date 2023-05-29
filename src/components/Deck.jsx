import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

const Deck = ({ svgUrl }) => {
  const svgRef = useRef(null);


  return (
    <Box
      ref={svgRef}
      component="img"
      src={svgUrl}
      alt="Deck"
      sx={{
        width: "316px",
        height: "482px",
        perspective: "1000px",
      }}
    />
  );
};

export default Deck;



//   useEffect(() => {
//     const animate = () => {
//       if (svgRef.current) {
//         svgRef.current.style.transform = `rotateY(${Date.now() * 0.01 % 360}deg)`;
//       }
//       requestAnimationFrame(animate);
//     };

//     animate();
//   }, []);