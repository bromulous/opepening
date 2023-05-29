import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SetsNavigator from "../components/SetsNavigator";
import PackReveal from "../components/PackReveal";
import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

const SetsPage = ({ address, onAddressSubmit, setNumber, updateSetNumber }) => {
    const { setAddress, setSetNumber } = useParams();
    const actualSetNumber = setNumber || setSetNumber;
    const [setName, setSetName] = useState("");
    const [cachedSets, setCachedSets] = useState({});
    const [opepenIds, setOpepenIds] = useState([]);
    const [submittedOpepenCount, setSubmittedOpepenCount] = useState({});
    const [images, setImages] = useState({});
    const [error, setError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cachedMetadata, setCachedMetadata] = useState({});
    const [revealedMetadata, setRevealedMetadata] = useState([]);
    const [cachedRevealedMetadata, setCachedRevealedMetadata] = useState({});
    const imageCache = useRef({});
    const [submittedCount, setSubmittedCount] = useState(0);
    const [previousAddress, setPreviousAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [inputAddress, setInputAddress] = useState("");
    const [isPackRevealed, setIsPackRevealed] = useState(false);
    // const [isPackRevealed, setIsPackRevealed] = useState(false);

    useEffect(() => {
        if (setAddress) {
            onAddressSubmit(setAddress);
        }
        if (setSetNumber) {
            updateSetNumber(setSetNumber);
        }
    }, [setAddress, setSetNumber, onAddressSubmit, updateSetNumber]);

    const handleOpenModal = (set, key, submittedCount) => {
        if (!address) {
            setShowAddressModal(true);
        } else {
            const revealed = cachedRevealedMetadata[set][key] || [];
            console.log(revealed);
            console.log(key);
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

    useEffect(() => {
        let theseCachedSets = cachedSets;
        if (address !== previousAddress) {
            setCachedSets({});
            setPreviousAddress(address);
            theseCachedSets = {};
        }
        const fetchSetNameAndOpepenIds = async () => {
            const setNameResponse = await fetch(
                `https://api.opepen.art/v1/opepen/sets/${setNumber}`
            );
            const setNameData = await setNameResponse.json();
            const setName = setNameData.name;

            const opepenIdsResponse = await fetch(
                `https://api.opepen.art/v1/accounts/${address}/sets/${setNumber}`
            );

            let opepenIds = [];
            if (opepenIdsResponse.ok) {
                const opepenIdsData = await opepenIdsResponse.json();
                opepenIds = opepenIdsData.opepen_ids;
            }

            setSetName(setName);
            setOpepenIds(opepenIds);

            const submittedOpepen = setNameData.submitted_opepen;
            const images = {
                1: setNameData.edition1Image,
                4: setNameData.edition4Image,
                5: setNameData.edition5Image,
                10: setNameData.edition10Image,
                20: setNameData.edition20Image,
                40: setNameData.edition40Image,
            };
            setImages(images);

            const submittedOpepenCount = Object.entries(submittedOpepen).reduce(
                (acc, [key, value]) => {
                    acc[key] = {
                        total: value.length,
                        submitted: value.filter((id) => opepenIds.includes(id))
                            .length,
                        ids: value.filter((id) => opepenIds.includes(id)),
                    };
                    return acc;
                },
                {}
            );

            const metadataResponse = await fetch(
                `https://api.opepen.art/v1/opepen/sets/${setNumber}/opepen`
            );
            const metadataData = await metadataResponse.json();
            setIsPackRevealed(metadataData.length > 0);

            const submittedIdsByGroup = Object.entries(
                submittedOpepenCount
            ).reduce((acc, [key, value]) => {
                acc[key] = value.ids;
                return acc;
            }, {});
            const metadataByGroup = Object.entries(submittedIdsByGroup).reduce(
                (acc, [key, ids]) => {
                    acc[key] = metadataData.filter((entry) =>
                        ids.includes(entry.token_id)
                    );
                    return acc;
                },
                {}
            );
            setCachedRevealedMetadata((prevMetadata) => ({
                ...prevMetadata,
                [setNumber]: {
                    ...prevMetadata[setNumber],
                    ...metadataByGroup,
                },
            }));

            // Cache the data
            setCachedSets((prevSets) => ({
                ...prevSets,
                [setNumber]: {
                    setName,
                    opepenIds,
                    submittedOpepenCount,
                    images,
                    isPackRevealed: metadataData.length > 0,
                },
            }));

            setSubmittedOpepenCount(submittedOpepenCount);
        };

        if (theseCachedSets[setNumber]) {
            // Use the cached data
            setSetName(cachedSets[setNumber].setName);
            setOpepenIds(cachedSets[setNumber].opepenIds);
            setSubmittedOpepenCount(cachedSets[setNumber].submittedOpepenCount);
            setImages(cachedSets[setNumber].images);
            setIsPackRevealed(cachedSets[setNumber].isPackRevealed);
        } else {
            fetchSetNameAndOpepenIds();
        }
    }, [setNumber, cachedSets, address]);

    return (
        <div>
            <SetsNavigator
                address={address}
                setNumber={parseInt(setNumber, 10)}
                setName={setName}
                updateSetNumber={updateSetNumber}
            />
            <Grid container justifyContent="center" spacing={2}>
                {Object.entries(submittedOpepenCount).map(([key, value]) => (
                    <Grid item key={key}>
                        <Card
                            onClick={() =>
                                handleOpenModal(setNumber, key, value.submitted)
                            }
                        >
                            {images[key] && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`${images[key].cdn}/${images[key].path}/${images[key].uuid}${images[key].type !== 'gif'? '@sm': ""}.${images[key].type}`}
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
                ))}
            </Grid>
            {/* Your other component JSX */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Open Pack</DialogTitle>
                <DialogContent>
                    <PackReveal
                        revealedMetadata={revealedMetadata}
                        submittedCount={submittedCount}
                        isPackRevealed={isPackRevealed}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
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
