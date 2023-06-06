import React, { forwardRef } from 'react';
import ReactCardFlip from "react-card-flip";

const Card = forwardRef(({ frontImage, backImage, isFlipped, onClick, canFlip, cardId }, ref) => {
    const handleClick = () => {
        if (canFlip) {
            onClick();
        }
    };

    const openSeaLink = `https://opensea.io/assets/ethereum/0x6339e5e072086621540d0362c4e3cea0d643e114/${cardId}`;

    return (
        <ReactCardFlip isFlipped={isFlipped}>
            <div
                onClick={handleClick}
                style={{
                    width: "2in",
                    height: "2.8in",
                    borderRadius: "15px",
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "black",
                }}
            >
                <img
                    src={backImage}
                    alt="Card Back"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </div>
            <a href={openSeaLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                <div
                    onClick={handleClick}
                    style={{
                        width: "2in",
                        height: "2.8in",
                        borderRadius: "15px",
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundColor: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                    }}
                >
                    <img
                        src={frontImage}
                        alt="Card Front"
                        style={{ width: "100%", height: "2.5in", objectFit: "contain" }}
                    />
                </div>
            </a>
        </ReactCardFlip>
    );
});

export default Card;