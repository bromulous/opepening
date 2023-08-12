import React, { forwardRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Card = forwardRef(
    ({ frontImage, backImage, isFlipped, onClick, canFlip, cardId, address, currentOwnerAddress }, ref) => {
        const [imageError, setImageError] = useState(false);

        const handleImageError = () => {
            setImageError(true);
        };

        const handleClick = async () => {
            if (!imageError && canFlip) {
                onClick();
            } else if (imageError) {
                try {
                    const response = await fetch(frontImage);
                    if (response.ok) {
                        setImageError(false);
                        onClick();
                    } else {
                        toast.error("Image is still processing");
                    }
                } catch (error) {
                    toast.error("Image is still processing");
                }
            }
        };

        const openSeaLink = `https://opensea.io/assets/ethereum/0x6339e5e072086621540d0362c4e3cea0d643e114/${cardId}`;

        return (
            <>
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
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </div>
                    <a
                        href={openSeaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", display: "block" }}
                    >
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
                                onError={handleImageError}
                                style={{
                                    width: "100%",
                                    height: "2.5in",
                                    objectFit: "contain",
                                }}
                            />
                            {/* Conditional rendering for the "Sold" label */}
                            {address.toLowerCase() !== currentOwnerAddress.toLowerCase() && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '5%',
                                    left: '50%',
                                    transform: 'translate(-50%, 0)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // semi-transparent background
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontWeight: 'bold'
                                }}>
                                    Sold
                                </div>
                            )}
                        </div>
                    </a>
                </ReactCardFlip>
                <ToastContainer />
            </>
        );
    }
);

export default Card;
