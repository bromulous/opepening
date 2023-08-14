import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import SetsNavigator from "../components/SetsNavigator";
import PackReveal from "../components/PackReveal";
import { Backdrop, CircularProgress } from "@mui/material";
import { useCachedSets } from "../components/CachedSetsContext";
import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

const SetsPage = ({ address, onAddressSubmit, setNumber, updateSetNumber }) => {
    const [setName, setSetName] = useState("");
    const {
        cachedSets,
        setCachedSets,
        address: contextAddress,
    } = useCachedSets();
    const [opepenIds, setOpepenIds] = useState([]);
    const [submittedOpepenCount, setSubmittedOpepenCount] = useState({});
    const [images, setImages] = useState({});
    const [error, setError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cachedMetadata, setCachedMetadata] = useState({});
    const [revealedMetadata, setRevealedMetadata] = useState([]);
    const imageCache = useRef({});
    const [submittedCount, setSubmittedCount] = useState(0);
    const [previousAddress, setPreviousAddress] = useState("");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [inputAddress, setInputAddress] = useState("");
    const [isPackRevealed, setIsPackRevealed] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [countdown, setCountdown] = useState("");
    const [revealsAt, setRevealsAt] = useState("");
    const [revealedBlockNumber, setRevealedBlockNumber] = useState(null);

    const handleOpenModal = (set, key, submittedCount) => {
        if (!address) {
            setShowAddressModal(true);
        } else {
            const revealed =
                cachedSets[setNumber]?.revealedMetadata?.[key] || [];
            setRevealedMetadata(revealed);
            setOpenModal(true);
            setSubmittedCount(submittedCount);
        }
    };

    const handleAddressSubmit = () => {
        onAddressSubmit(inputAddress);
        setShowAddressModal(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const getSmallestImageUrl = (image) => {
        const version = image.versions.sm ? "@sm" : "";
        return `${image.cdn}/${image.path}/${image.uuid}${version}.${image.type}`;
    };

    useEffect(() => {
        const resetCachedSets = () => {
            setCachedSets({});
        };

        if (contextAddress !== address) {
            resetCachedSets();
        }
    }, [contextAddress, address]);

    useEffect(() => {
        const revealTime = new Date(revealsAt);
        let timer;

        const updateTimer = () => {
            const now = new Date();
            const timeDifference = revealTime - now;

            if (timeDifference > 0) {
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor(
                    (timeDifference % (1000 * 60)) / 1000
                );

                setCountdown(`${hours}h ${minutes}m ${seconds}s until reveal`);
            } else {
                if (revealedBlockNumber !== null) {
                    if (isPackRevealed) {
                        setCountdown(
                            `Reveal Block Number: ${revealedBlockNumber}`
                        );
                    } else {
                        setCountdown(
                            `Sumbitted at Block Number: ${revealedBlockNumber}. Waiting on metadata to propagate... \n(refresh your page)`
                        );
                    }
                    clearInterval(timer);
                } else {
                    if (revealsAt === null) {
                        setCountdown("Set not yet announced");
                    } else {
                        setCountdown("Reveal will happen shortly");
                    }
                }
            }
        };

        // Start the timer
        updateTimer();
        timer = setInterval(updateTimer, 1000);

        // Clear the timer on component unmount
        return () => clearInterval(timer);
    }, [revealsAt, revealedBlockNumber, isPackRevealed]);

    useEffect(() => {
        const fetchSetNameAndOpepenIds = async () => {
            const setNameResponse = await fetch(
                `https://api.opepen.art/v1/opepen/sets/${setNumber}`
            );
            const setNameData = await setNameResponse.json();
            const setName = setNameData.name;
            const revealsAt = setNameData.reveals_at;
            const revealedBlockNumber = setNameData.reveal_block_number;
            setSetName(setName);
            setRevealsAt(revealsAt);
            setRevealedBlockNumber(revealedBlockNumber);

            const images = {
                1: setNameData.edition1Image,
                4: setNameData.edition4Image,
                5: setNameData.edition5Image,
                10: setNameData.edition10Image,
                20: setNameData.edition20Image,
                40: setNameData.edition40Image,
            };
            setImages(images);

            /*
            demand = {
                "1": 100,
                "4": 100,
                "5": 100,
                "10": 100,
                "20": 100,
                "40": 100,
                total: 600
            }
            */
            // This is total amount submitted from everyone
            const demand = setNameData.submission_stats.demand;

            let opepenIdsResponse = null;
            if (address) {
                opepenIdsResponse = await fetch(
                    `https://api.opepen.art/v1/accounts/${address}/sets/${setNumber}`
                );
            }

            let opepenIds = []; // This is a list of opepen ids submitted
            let max_reveals = {
                1: 0,
                4: 0,
                5: 0,
                10: 0,
                20: 0,
                40: 0,
                total: 0,
            }; // This is the maximum amount they can receive per set {"set_number": int_amount}
            if (opepenIdsResponse && opepenIdsResponse.ok) {
                const opepenIdsData = await opepenIdsResponse.json();
                opepenIds = opepenIdsData.opepen_ids;
                max_reveals = opepenIdsData.max_reveals;
            }
            setOpepenIds(opepenIds);

            const submittedOpepenCount = Object.entries(demand).reduce(
                (acc, [key, value]) => {
                    if (key !== "total") {
                        acc[key] = {
                            total: value,
                            submitted: max_reveals[key],
                        };
                    }
                    return acc;
                },
                {}
            );

            const metadataResponse = await fetch(
                `https://api.opepen.art/v1/opepen/sets/${setNumber}/opepen`
            );
            let metadataData = [];
            if (metadataResponse.ok) {
                metadataData = await metadataResponse.json();
            }
            const isPackRevealed = metadataData.length > 0;
            setIsPackRevealed(isPackRevealed);

            let metadataByGroup = {};
            metadataData.forEach((item) => {
                if (opepenIds.includes(item.token_id)) {
                    if (!metadataByGroup[item.data.edition]) {
                        metadataByGroup[item.data.edition] = [];
                    }
                    metadataByGroup[item.data.edition].push(item);
                }
            });

            // Cache the data
            setCachedSets((prevSets) => {
                const shouldResetRevealedMetadata =
                    prevSets[setNumber]?.address !== contextAddress;

                return {
                    ...prevSets,
                    [setNumber]: {
                        setName,
                        revealsAt,
                        revealedBlockNumber,
                        opepenIds,
                        submittedOpepenCount,
                        images,
                        isPackRevealed,
                        revealedMetadata: shouldResetRevealedMetadata
                            ? metadataByGroup
                            : {
                                  ...prevSets[setNumber]?.revealedMetadata,
                                  ...metadataByGroup,
                              },
                        address: contextAddress,
                    },
                };
            });

            setSubmittedOpepenCount(submittedOpepenCount);
        };

        const revealTime = new Date(revealsAt);
        let timer;

        const shouldRefetchData =
            !cachedSets[setNumber] ||
            cachedSets[setNumber]?.address !== contextAddress;

        if (shouldRefetchData) {
            fetchSetNameAndOpepenIds().then(() => setDataLoading(false));
        } else {
            // Use the cached data
            setSetName(cachedSets[setNumber].setName);
            setRevealsAt(cachedSets[setNumber].revealsAt);
            setRevealedBlockNumber(cachedSets[setNumber].revealedBlockNumber);
            setOpepenIds(cachedSets[setNumber].opepenIds);
            setSubmittedOpepenCount(cachedSets[setNumber].submittedOpepenCount);
            setImages(cachedSets[setNumber].images);
            setIsPackRevealed(cachedSets[setNumber].isPackRevealed);
            setDataLoading(false);
        }
    }, [setNumber, contextAddress]);

    const LoadingCard = () => (
        <Card>
            <CardMedia
                component="div"
                height="140"
                sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </CardMedia>
            <CardContent>
                <Typography variant="h6" color="text.secondary">
                    Loading...
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Set
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <div>
            <SetsNavigator
                address={address}
                setNumber={parseInt(setNumber, 10)}
                setName={setName}
                updateSetNumber={updateSetNumber}
            />
            <Box marginBottom={2} marginTop={2}>
            <Typography variant="h6" align="center">
                {dataLoading ? " " : countdown}
            </Typography>
            </Box>
            <Grid container justifyContent="center" spacing={2}>
                {dataLoading
                    ? Array.from({ length: 6 }, (_, i) => (
                          <Grid item key={i}>
                              <LoadingCard />
                          </Grid>
                      ))
                    : Object.entries(submittedOpepenCount).map(
                          ([key, value]) => (
                              <Grid item key={key}>
                                  <Card
                                      onClick={() =>
                                          handleOpenModal(
                                              setNumber,
                                              key,
                                              value.submitted
                                          )
                                      }
                                  >
                                      {images[key] && (
                                          <CardMedia
                                              component="img"
                                              height="140"
                                              image={getSmallestImageUrl(
                                                  images[key]
                                              )}
                                              alt={`Set ${key} image`}
                                          />
                                      )}
                                      <CardContent>
                                          <Typography variant="h6">
                                              {!address
                                                  ? `${value.total} opepens subscribed`
                                                  : `${value.submitted} submitted out of ${value.total}`}
                                          </Typography>
                                          <Typography variant="subtitle1">
                                              Set {key}
                                          </Typography>
                                      </CardContent>
                                  </Card>
                              </Grid>
                          )
                      )}
            </Grid>
            {/* Your other component JSX */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <PackReveal
                        revealedMetadata={revealedMetadata}
                        submittedCount={submittedCount}
                        isPackRevealed={isPackRevealed}
                        address={address}
                    />
                </DialogContent>
            </Dialog>
            <Dialog
                open={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Enter Your Address</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Address"
                        type="text"
                        fullWidth
                        value={inputAddress}
                        onChange={(e) => setInputAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowAddressModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleAddressSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            
        </div>
    );
};

export default SetsPage;
