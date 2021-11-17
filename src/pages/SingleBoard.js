import React, { useEffect, useState } from "react";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import { updateBoard } from "../api-config/boards";
import { useParams } from "react-router";
import Modal from "@material-ui/core/Modal";
import Circle from "@uiw/react-color-circle";
import { fireStore } from "../firebase/config";
import CardDetailsModal from "../modules/CardDetailsModal";
import CustomTrelloLaneCard from "../components/CustomTrelloLaneCard";

const labelColor = {
  backgroundColor: "#fff",
  position: "absolute",
  top: "40%",
  left: "30%",
  padding: "30px",
};

function SingleBoard() {
  const user = JSON.parse(localStorage.getItem("user"));

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

  const onConfirmCardDelete = (params) => {
    const doDelete = window.confirm("Are you sure?");
    if (doDelete) {
      params();
    }
  };

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
      style={{
        // backgroundImage: `url(${img})`,
        backgroundColor: "rgb(97 102 117)",
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        // backgroundSize: "cover",
        paddingTop: "45px",
        paddingBottom: "30px",
        // height: "100vh",
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
          console.log("card add from lane");
          setCardModelOpen(true);
          setCardToAddDetail({ card, laneId });
        }}
        onCardClick={(cardid, meta, laneId) => {
          console.log("card click");
          handleCardClick(cardid, meta, laneId);
        }}
        components={{
          Card: (Cardprops) => {
            return <CustomTrelloLaneCard {...Cardprops} />;
          },
        }}
      />
      <Modal
        open={modelOpen}
        onClose={() => {
          setClickedCardDetail({});
        }}
      >
        <div style={labelColor}>
          <div
            style={{ textAlign: "right", fontSize: "24px", cursor: "pointer" }}
            onClick={() => setModelOpen(false)}
          >
            X
          </div>

          <h2>Add Label </h2>
          <Circle
            colors={[
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
            ]}
            onChange={(color) => handleSetLaneColor(color)}
          />
        </div>
      </Modal>
      <Modal open={cardModelOPen} onClose={() => setCardModelOpen(false)}>
        <div style={labelColor}>
          <div
            style={{ textAlign: "right", fontSize: "24px", cursor: "pointer" }}
            onClick={() => setCardModelOpen(false)}
          >
            X
          </div>

          <h2>Add Label </h2>
          <Circle
            colors={[
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
              "#F44E3B",
              "#FE9200",
              "#FCDC00",
              "#DBDF00",
            ]}
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
