import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import opepenPackShadow from "../assets/img/opepen-pack-shadow.png";
import lightCardBack from "../assets/img/light-card-back.png";
import { useSpring, animated, useTransition } from "react-spring";
import { Typography } from "@mui/material";
import styles from "../styles/PackReveal.module.css";
import Card from "./Card";

const CardConfetti = ({ show }) => {
    const [confetti, setConfetti] = useState(show);

    React.useEffect(() => {
        if (show) {
            setConfetti(true);
            setTimeout(() => {
                setConfetti(false);
            }, 4000);
        }
    }, [show]);

    return confetti ? (
        <div className={styles.confetti}>
            <Confetti />
        </div>
    ) : null;
};

const PackReveal = ({ revealedMetadata, submittedCount, isPackRevealed }) => {
    const [packStatus, setPackStatus] = useState("closed");
    const [flippedCards, setFlippedCards] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSlidingOut, setIsSlidingOut] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const containerRef = useRef(null);
    const cardsRefs = useRef([]);
    const [offsets, setOffsets] = useState([]);
    const [cardMoveAnimation, setCardMoveAnimation] = useState(false);
    const [cardsReset, setCardsReset] = useState(false);
    const [cardsMoved, setCardsMoved] = useState(false);
    const [showPackImage, setShowPackImage] = useState(true);

    useEffect(() => {
        if (showCards && containerRef.current && !cardsMoved) {
            const containerBounds =
                containerRef.current.getBoundingClientRect();

            cardsRefs.current.forEach((card, index) => {
                const cardBounds = card.getBoundingClientRect();
                const desiredLeft =
                    containerBounds.left +
                    (containerBounds.width - cardBounds.width) / 2;
                const desiredTop =
                    containerBounds.top +
                    (containerBounds.height - cardBounds.height) / 2;
                const targetLeft = desiredLeft - cardBounds.left;
                const targetTop = desiredTop - cardBounds.top;
                offsets[index] = [-targetLeft, -targetTop];
                setOffsets([...offsets]);

                card.style.left = `${targetLeft}px`;
                card.style.top = `${targetTop}px`;
            });
            setCardsMoved(true);
        }
        if (cardsReset) {
            cardsRefs.current.forEach((card, index) => {
                card.style.left = "0px";
                card.style.top = "0px";
                card.style.transition = `all ${1 + index * 0.2}s`;
            });
            setTimeout(() => {
                cardsRefs.current.forEach((card) => {
                    card.style.transition = "none";
                });
                setCardsReset(false);
                //   setCardsMoved(false);
            }, 1000 + cardsRefs.current.length * 200);
        }
    }, [showCards, cardsReset, cardsMoved]);

    const shakeAnimation = useSpring({
        from: { transform: "rotate(0deg) scale(1)" },
        to: [
            { transform: "rotate(5deg) scale(1.05)" },
            { transform: "rotate(-5deg) scale(0.95)" },
            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(-5deg) scale(1.05)" },
            { transform: "rotate(5deg) scale(0.95)" },
            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(5deg) scale(1.05)" },
            { transform: "rotate(-5deg) scale(0.95)" },
            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(5deg) scale(1.05)" },
            { transform: "rotate(-5deg) scale(0.95)" },
            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(-5deg) scale(1.05)" },
            { transform: "rotate(5deg) scale(0.95)" },
            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(5deg) scale(1.05)" },
            { transform: "rotate(-5deg) scale(0.95)" },
            { transform: "rotate(0deg) scale(1.05)" },
        ],
        config: { duration: 100 },
        reset: isAnimating,
        onRest: () => {
            if (isAnimating) {
                setIsAnimating(false);
                setTimeout(() => {
                    handlePackClick();
                }, 2500); // Add a delay before calling handlePackClick
            }
        },
    });

    const cardPositionAnimation = useSpring({
        position: isSlidingOut ? "relative" : "absolute",
        config: { duration: 500 }, // Adjust the duration as needed
    });

    const slideOutAnimation = useSpring({
        transform: isSlidingOut ? "translateY(110%)" : "translateY(0%)",
        config: { duration: 1000 },
        onRest: () => {
            if (isSlidingOut) {
                handlePackClick();
                setCardsReset(true);
                setShowPackImage(false); // Hide the pack image after the animation
            }
        },
    });

    const handlePackImageClick = () => {
        if (!isAnimating && isPackRevealed) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 1000); // Wait for the shake animation to complete
            setTimeout(() => {
                setShowCards(true); // Show the cards after the shake animation
            }, 1000);
            setTimeout(() => {
                setIsSlidingOut(true);
            }, 1500); // Add a delay before setting isSlidingOut to true (500ms pause)
        }
    };

    const handlePackClick = () => {
        if (packStatus === "closed" && isPackRevealed) {
            if (revealedMetadata.length > 0) {
                setPackStatus("cards");
            } else {
                setPackStatus("opened");
            }
        }
    };

    const handleCardClick = (index) => {
        if (!flippedCards.includes(index)) {
            setFlippedCards([...flippedCards, index]);
        }
    };

    const cardMovementAnimation = useSpring(
        revealedMetadata.length,
        revealedMetadata.map((_, index) => ({
            transform: cardMoveAnimation
                ? `translate(${offsets[index][0]}px, ${offsets[index][1]}px)`
                : "translate(0px, 0px)",
            config: { duration: 1000 },
        }))
    );

    return (
        <div className="packRevealContainer">
            {flippedCards.map((index) => (
                <CardConfetti key={index} show={flippedCards.includes(index)} />
            ))}
    
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    minHeight: "4.2in", // Set a minimum height for the container
                }}
            >
                <div
                    ref={containerRef}
                    style={{
                        position: "absolute",
                        zIndex: 2, // Set a higher zIndex for the pack container
                        pointerEvents: showCards ? "none" : "auto", // Add pointer-events property
                    }}
                >
                    {submittedCount === 0 && (
                        <Typography variant="body1">
                            No Opepens submitted for this collection.
                        </Typography>
                    )}
                    {submittedCount > 0 && (
                        <div
                            style={{
                                position: "relative",
                            }}
                        >
                            {submittedCount > 0 && !isPackRevealed && showPackImage && (
                                <Typography
                                    variant="h5"
                                    style={{
                                        zIndex: 2,
                                        position: "absolute",
                                        top: "70%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        // backgroundColor: "rgba(255, 255, 255, 0.8)",
                                        // padding: "0.5rem",
                                        // borderRadius: "0.25rem",
                                        textAlign: "center",
                                    }}
                                >
                                    Pack not released yet
                                </Typography>
                            )}
                            {showPackImage && (
                                <animated.img
                                    src={opepenPackShadow}
                                    alt="Opepen Pack"
                                    onClick={handlePackImageClick}
                                    style={{
                                        ...(isAnimating
                                            ? shakeAnimation
                                            : slideOutAnimation),
                                        cursor: "pointer",
                                        width: "3in",
                                        height: "4.2in",
                                    }}
                                />
                            )}
                        </div>
                    )}
                    {packStatus === "opened" && <h3>Pack Empty</h3>}
                </div>
    
                <div
                    style={{
                        position: "relative",
                        zIndex: 1, // Set a lower zIndex for the cards container
                        maxHeight: "100%",
                        overflowY: "auto",
                        height: "50vh",
                    }}
                >
                    {showCards && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                            }}
                        >
                            {revealedMetadata.map((entry, index) => (
                                <animated.div
                                    key={index}
                                    ref={(el) =>
                                        (cardsRefs.current[index] = el)
                                    }
                                    style={{
                                        ...cardMovementAnimation[index],
                                        position: "relative",
                                        zIndex:
                                            revealedMetadata.length - index, // Set zIndex in descending order
                                        margin: "0.5rem",
                                    }}
                                >
                                    <Card
                                        frontImage={`${entry.image.cdn}/${entry.image.path}/${entry.image.uuid}.${entry.image.type}`}
                                        backImage={lightCardBack}
                                        isFlipped={flippedCards.includes(index)}
                                        onClick={() => handleCardClick(index)}
                                        canFlip={true}
                                        cardId={revealedMetadata[index].token_id}
                                    />
                                </animated.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PackReveal;
