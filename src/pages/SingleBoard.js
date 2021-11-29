import React, { useEffect, useState } from "react";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import {
  getUsersBoards,
  getUsersFromFeatureBoards,
  updateBoard,
} from "../api-config/boards";
import { useHistory, useParams } from "react-router";
import Modal from "@material-ui/core/Modal";
import Circle from "@uiw/react-color-circle";
import CloseIcon from "@material-ui/icons/Close";
import { fireStore } from "../firebase/config";
import CardDetailsModal from "../modules/CardDetailsModal";
import CustomTrelloLaneCard from "../components/CustomTrelloLaneCard";
import { laneColors } from "../constants/boardColors";
import { useOutSideClick } from "../hooks/useOutsideClick";
import { makeStyles } from "@material-ui/core/styles";
import { media } from "../constants/mobileView";
import "../App.css";

const useStyles = makeStyles((theme) => ({
  mainBackground: {
    padding: "60px 25px 30px 20px",
    postion: "relative",
    [media]: {
      padding: "60px 15px 30px 15px",
    },
  },
  labelColor: {
    backgroundColor: "#fff",
    position: "absolute",
    top: "50%",
    left: "50%",
    padding: "30px",
    transform: "translate(-50%,-50%)",
    [media]: {
      width: "90%",
    },
  },
  lane: {
    // maxHeight: "50vh",
    // overflow: "scroll",
    // overflowX: "hidden",
  },
}));

function SingleBoard({ isFocused, searchBoard, setIsFocused }) {
  const classes = useStyles();

  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const [data, setData] = useState({ lanes: [] });
  const [dataTopass, setDatatoPass] = useState(null);
  const { projectId, userName } = useParams();
  const [modelOpen, setModelOpen] = useState(false);
  const [cardModelOPen, setCardModelOpen] = useState(false);
  const [cardToAddDetail, setCardToAddDetail] = useState({});
  const [clickedCardDetail, setClickedCardDetail] = useState({
    modelOpen: false,
  });
  const [editCardTitle, seteditCardTitle] = useState(clickedCardDetail?.title);
  const [editCardDetail, seteditCardDetail] = useState(
    clickedCardDetail?.description
  );
  const [allboards, setallBoard] = useState([]);

  const onConfirmCardDelete = (params) => {
    const doDelete = window.confirm("Are you sure?");
    if (doDelete) {
      params();
    }
  };

  useEffect(() => {
    const fecthAll = async () => {
      const result = await Promise.all([
        getUsersBoards(user.name),
        getUsersFromFeatureBoards("members", user.name),
      ]);
      setallBoard([...result.flat()]);
    };
    fecthAll();
  }, []);

  const handleSetLaneColor = (color) => {
    updateBoard(
      projectId,
      "lanes",
      data?.lanes?.map((lane, i) => {
        if (i === data.lanes.length - 1) {
          return { ...lane, style: { backgroundColor: color.hex } };
        }
        return lane;
      })
    );
    setModelOpen(false);
  };

  const handleSetCardColor = async (color) => {
    await updateBoard(
      projectId,
      "lanes",
      data?.lanes?.map((lane) => {
        if (lane.id === cardToAddDetail.laneId) {
          return {
            ...lane,
            cards: lane.cards.map((card) => {
              if (card.id === cardToAddDetail.card.id) {
                return { ...card, style: { backgroundColor: color.hex } };
              }
              return card;
            }),
          };
        }
        return lane;
      })
    );
    setCardModelOpen(false);
    setCardToAddDetail({});
  };

  const handleCardClick = (
    cardId,
    meta,
    laneId,
    handleCardClickFrom = "normal"
  ) => {
    if (handleCardClickFrom === "normal") {
      const card = data.lanes
        .find((lane) => lane.id === laneId)
        .cards.find((c) => c.id === cardId);
      setClickedCardDetail({ ...card, modelOpen: true });
    } else {
      fireStore
        .collection("boards")
        .doc(projectId)
        .get()
        .then((doc) => {
          setData(doc.data());
          setDatatoPass(doc.data());
          const card = doc
            .data()
            .lanes.find((lane) => lane.id === laneId)
            .cards.find((c) => c.id === cardId);
          setClickedCardDetail({ ...card, modelOpen: true });
        });
    }
  };

  const onDataChange = (updatedData) => {
    setData(updatedData);
    updateBoard(projectId, "lanes", updatedData.lanes);
  };

  useEffect(() => {
    fireStore
      .collection("boards")
      .doc(projectId)
      .onSnapshot((doc) => {
        setData(doc.data());
        setDatatoPass(doc.data());
      });
  }, [projectId]);

  return (
    <div
      className={classes.mainBackground}
      style={{
        backgroundColor: dataTopass?.boardColor,
        // padding: "60px 25px 30px 20px",
        // postion: "relative",
      }}
    >
      <ProjectDetailsNavbar
        projectTitle={dataTopass?.title}
        user={userName}
        projectId={projectId}
        members={dataTopass?.members || []}
        boardUser={dataTopass?.user}
        favourite={dataTopass?.favourite || []}
      />

      <Board
        className={classes.lane}
        data={{ lanes: data?.lanes || [] }}
        draggable
        canAddLanes
        addCardTitle="Add Item"
        style={{ backgroundColor: "transparent" }}
        editable
        onBeforeCardDelete={onConfirmCardDelete}
        onDataChange={onDataChange}
        collapsibleLanes={true}
        editLaneTitle={true}
        onLaneAdd={(e) => {
          setModelOpen(true);
        }}
        onCardAdd={(card, laneId) => {
          setCardModelOpen(true);
          setCardToAddDetail({ card, laneId });
        }}
        onCardClick={(cardid, meta, laneId) => {
          handleCardClick(cardid, meta, laneId);
        }}
        components={{
          Card: (Cardprops) => {
            return <CustomTrelloLaneCard {...Cardprops} />;
          },
        }}
      />
      {isFocused && (
        <div className="popupsearchedboards" onClick={() => setIsFocused(true)}>
          <h5 style={{ marginBottom: "10px" }}>Searched Boards</h5>
          {allboards.filter((board) =>
            board.data.title.toUpperCase().includes(searchBoard.toUpperCase())
          ).length === 0 ? (
            <h4>No boards to show</h4>
          ) : (
            searchBoard !== "" &&
            allboards
              .filter((board) =>
                board.data.title
                  .toUpperCase()
                  .includes(searchBoard.toUpperCase())
              )
              .map((item) => (
                <p
                  key={item.id}
                  className="boards_inside_popover"
                  onClick={() => history.push(`/${user.name}/${item.id}`)}
                >
                  {item.data.title}
                </p>
              ))
          )}
        </div>
      )}
      <Modal
        open={modelOpen}
        onClose={() => {
          setClickedCardDetail({});
        }}
      >
        <div className={classes.labelColor}>
          <div
            style={{ textAlign: "right", fontSize: "24px", cursor: "pointer" }}
            onClick={() => setModelOpen(false)}
          >
            <CloseIcon />
          </div>

          <h2 style={{ marginBottom: "10px" }}>Add Label </h2>
          <Circle
            colors={laneColors}
            onChange={(color) => handleSetLaneColor(color)}
          />
        </div>
      </Modal>
      <Modal open={cardModelOPen} onClose={() => setCardModelOpen(false)}>
        <div className={classes.labelColor}>
          <div
            style={{ textAlign: "right", fontSize: "24px", cursor: "pointer" }}
            onClick={() => setCardModelOpen(false)}
          >
            <CloseIcon />
          </div>

          <h2 style={{ marginBottom: "10px" }}>Add Label </h2>
          <Circle
            colors={laneColors}
            onChange={(color) => handleSetCardColor(color)}
          />
        </div>
      </Modal>
      <Modal
        open={clickedCardDetail?.modelOpen}
        onClose={() => {
          setClickedCardDetail({ openModal: false });
          seteditCardTitle("");
          seteditCardDetail("");
        }}
        style={{ overflowY: "scroll" }}
      >
        <CardDetailsModal
          data={data}
          clickedCardDetail={clickedCardDetail}
          user={user}
          boardUser={dataTopass?.user}
          projectId={projectId}
          handleCardClick={handleCardClick}
          editCardTitle={editCardTitle}
          seteditCardTitle={seteditCardTitle}
          editCardDetail={editCardDetail}
          seteditCardDetail={seteditCardDetail}
          boardLabels={dataTopass?.labels}
          onClose={() => {
            setClickedCardDetail({ openModal: false });
            seteditCardTitle("");
            seteditCardDetail("");
          }}
          members={dataTopass?.members}
        />
      </Modal>
    </div>
  );
}

export default React.memo(SingleBoard);
