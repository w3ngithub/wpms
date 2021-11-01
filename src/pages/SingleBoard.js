import React, { useEffect, useState } from "react";
import ProjectDetailsNavbar from "../modules/ProjectDetailsNavbar";
import Board from "react-trello";
import { updateBoard } from "../api-config/boards";
import { useParams } from "react-router";
import Modal from "@material-ui/core/Modal";
import Circle from "@uiw/react-color-circle";
import { fireStore } from "../firebase/config";
import { MdSubtitles } from "@react-icons/all-files/md/MdSubtitles";
import { CgDetailsMore } from "@react-icons/all-files/cg/CgDetailsMore";
import { MdLocalActivity } from "@react-icons/all-files/md/MdLocalActivity";
import EditableTextField from "../components/EditableTextField";
import { Avatar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const labelColor = {
  backgroundColor: "#fff",
  position: "absolute",
  top: "40%",
  left: "30%",
  padding: "30px",
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#f3f1f1",
    color: "black",
    cursor: "pointer",
  },
}));

function SingleBoard() {
  const classes = useStyles();
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
  const [showSaveComment, setShowSaveComment] = useState(false);

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

  const handleCardClick = (cardId, meta, laneId) => {
    const card = data.lanes
      .find((lane) => lane.id === laneId)
      .cards.find((c) => c.id === cardId);
    setClickedCardDetail({ ...card, modelOpen: true });
  };

  const onDataChange = (updatedData) => {
    setData(updatedData);
    updateBoard(projectId, "lanes", updatedData.lanes);
  };

  const oneditCardTitleChange = (e) => seteditCardTitle(e.target.value);
  const oneEditCardDetailChange = (e) => seteditCardDetail(e.target.value);

  const onSaveeditCardTitle = () => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? { ...card, title: editCardTitle }
                : card
            ),
          }
        : lane
    );
    updateBoard(projectId, "lanes", updatedCardData);
  };

  const onSaveeditCardDetail = () => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? { ...card, description: editCardDetail }
                : card
            ),
          }
        : lane
    );
    updateBoard(projectId, "lanes", updatedCardData);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    comments: [
                      ...(card?.comments || ""),
                      {
                        commentBy: user?.name,
                        comment: e.target.comment.value,
                        id: Date.now(),
                      },
                    ],
                  }
                : card
            ),
          }
        : lane
    );
    await updateBoard(projectId, "lanes", updatedCardData);
    document.getElementById("commentForm").reset();
    handleCardClick(clickedCardDetail.id, null, clickedCardDetail.laneId);
  };

  useEffect(() => {
    if (data.length) {
      handleCardClick(clickedCardDetail.id, null, clickedCardDetail.laneId);
    }
  }, [data, clickedCardDetail.id, null, clickedCardDetail.laneId]);

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
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        paddingTop: "45px",
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
        style={{ backgroundColor: "transparent", maxHeight: "546px" }}
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
        onCardClick={(cardid, meta, laneId) =>
          handleCardClick(cardid, meta, laneId)
        }
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
      >
        <div
          style={{
            ...labelColor,
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "space-between",
            top: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <div>
              <MdSubtitles style={{ fontSize: "24px" }} />
            </div>
            <div>
              <EditableTextField
                oldTitle={clickedCardDetail.title}
                title={editCardTitle || clickedCardDetail.title}
                onChange={oneditCardTitleChange}
                save={onSaveeditCardTitle}
                style={{ minWidth: "230px" }}
              />
              <p>
                in list{" "}
                {
                  data.lanes.find(
                    (lane) => lane.id === clickedCardDetail?.laneId
                  )?.title
                }
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <div>
              <CgDetailsMore style={{ fontSize: "24px" }} />
            </div>
            <div>
              <h4>Description</h4>
              <EditableTextField
                oldTitle={clickedCardDetail.description}
                title={editCardDetail || clickedCardDetail.description}
                onChange={oneEditCardDetailChange}
                save={onSaveeditCardDetail}
                style={{ minWidth: "230px" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MdLocalActivity style={{ fontSize: "24px" }} />
              <h4>Activity</h4>
            </div>
            <div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Avatar alt="PM" className={classes.avatar}>
                  {user?.name[0]?.toUpperCase()}
                </Avatar>
                <form
                  onSubmit={handleSubmitComment}
                  style={{ display: "flex", gap: "10px" }}
                  id="commentForm"
                >
                  <textarea
                    type="text"
                    name="comment"
                    placeholder="Write a comment..."
                    style={{ minWidth: "300px", padding: "5px" }}
                    onFocus={() => setShowSaveComment(true)}
                    // onBlur={() => setShowSaveComment(false)}
                  />
                  {showSaveComment && (
                    <Button color="primary" variant="contained" type="submit">
                      Save
                    </Button>
                  )}
                </form>
              </div>
            </div>
            <div>
              {clickedCardDetail?.comments
                ?.slice()
                .reverse()
                .map?.((comment) => (
                  <div
                    style={{ display: "flex", gap: "10px" }}
                    key={comment.id}
                  >
                    <Avatar alt="PM" className={classes.avatar}>
                      {comment?.commentBy[0]?.toUpperCase()}
                    </Avatar>

                    <div>
                      <h4>{comment.commentBy}</h4>
                      <textarea
                        style={{ minWidth: "300px", padding: "5px" }}
                        disable={true}
                        value={comment.comment}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(SingleBoard);
