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
    const { cachedSets, setCachedSets, address:contextAddress } = useCachedSets();
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
    const [previousAddress, setPreviousAddress] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [inputAddress, setInputAddress] = useState("");
    const [isPackRevealed, setIsPackRevealed] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);

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
        const fetchSetNameAndOpepenIds = async () => {
            const setNameResponse = await fetch(
                `https://api.opepen.art/v1/opepen/sets/${setNumber}`
            );
            const setNameData = await setNameResponse.json();
            const setName = setNameData.name;

            let opepenIdsResponse = null;
            if (address) {
                opepenIdsResponse = await fetch(
                    `https://api.opepen.art/v1/accounts/${address}/sets/${setNumber}`
                );
            }

            let opepenIds = [];
            if (opepenIdsResponse && opepenIdsResponse.ok) {
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

        if (cachedSets[setNumber]) {
            // Use the cached data
            setSetName(cachedSets[setNumber].setName);
            setOpepenIds(cachedSets[setNumber].opepenIds);
            setSubmittedOpepenCount(cachedSets[setNumber].submittedOpepenCount);
            setImages(cachedSets[setNumber].images);
            setIsPackRevealed(cachedSets[setNumber].isPackRevealed);
            setDataLoading(false);
        } else {
            fetchSetNameAndOpepenIds().then(() => setDataLoading(false));
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
