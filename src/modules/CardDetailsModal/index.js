import React, { useState } from "react";
import { Avatar, Button, makeStyles, styled } from "@material-ui/core";
import { MdLocalActivity } from "@react-icons/all-files/md/MdLocalActivity";
import { MdSubtitles } from "@react-icons/all-files/md/MdSubtitles";
import EditableTextField from "../../components/EditableTextField";
import { CgDetailsMore } from "@react-icons/all-files/cg/CgDetailsMore";
import { ImAttachment } from "@react-icons/all-files/im/ImAttachment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { updateBoard } from "../../api-config/boards";
import { removeFile, uploadFile } from "../../api-config/uploadFile";
import "./style.css";

dayjs.extend(relativeTime);

const labelColor = {
  backgroundColor: "#fff",
  position: "absolute",
  top: "40%",
  left: "30%",
  padding: "30px",
};

const Input = styled("input")({
  display: "none",
});

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

function CardDetailsModal({
  clickedCardDetail,
  data,
  handleCardClick,
  projectId,
  user,
  seteditCardTitle,
  seteditCardDetail,
  editCardTitle,
  editCardDetail,
}) {
  const classes = useStyles();

  const [showSaveComment, setShowSaveComment] = useState(false);

  const [showAllAttachments, setShowAllAttachments] = useState(false);

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
    handleCardClick(
      clickedCardDetail.id,
      null,
      clickedCardDetail.laneId,
      "special"
    );
  };

  const handleUploadFile = (e) => {
    const upload = uploadFile(e.target.files[0]);
    upload.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        upload.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          const updatedCardData = data.lanes.map((lane) =>
            lane.id === clickedCardDetail.laneId
              ? {
                  ...lane,
                  cards: lane.cards.map((card) =>
                    card.id === clickedCardDetail.id
                      ? {
                          ...card,
                          attachments: [
                            ...(card.attachments || ""),
                            { downloadURL, name: e.target.files[0].name },
                          ],
                        }
                      : card
                  ),
                }
              : lane
          );
          await updateBoard(projectId, "lanes", updatedCardData);
          handleCardClick(
            clickedCardDetail.id,
            null,
            clickedCardDetail.laneId,
            "special"
          );
        });
      }
    );
  };

  const handleDeleteFile = (file) => {
    removeFile(file.name).then(async () => {
      const updatedCardData = data.lanes.map((lane) =>
        lane.id === clickedCardDetail.laneId
          ? {
              ...lane,
              cards: lane.cards.map((card) =>
                card.id === clickedCardDetail.id
                  ? {
                      ...card,
                      attachments: card.attachments.filter(
                        (attachment) => attachment.name !== file.name
                      ),
                    }
                  : card
              ),
            }
          : lane
      );
      await updateBoard(projectId, "lanes", updatedCardData);
      handleCardClick(
        clickedCardDetail.id,
        null,
        clickedCardDetail.laneId,
        "special"
      );
    });
  };

  return (
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
              data?.lanes?.find((lane) => lane.id === clickedCardDetail?.laneId)
                ?.title
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
      {clickedCardDetail.attachments && clickedCardDetail.attachments.length && (
        <div>
          <h3>
            <ImAttachment />
            Attachment
          </h3>
          {showAllAttachments
            ? clickedCardDetail?.attachments?.map((file) => (
                <li key={file.downloadURL}>
                  <a href={file.downloadURL} target="_blank">
                    {file.name}
                  </a>
                  <span> - </span>
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleDeleteFile(file)}
                  >
                    {" "}
                    Delete
                  </span>
                </li>
              ))
            : clickedCardDetail?.attachments?.slice(0, 2).map((file) => (
                <li key={file.downloadURL}>
                  <a href={file.downloadURL} target="_blank">
                    {file.name}
                  </a>
                  <span> - </span>
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleDeleteFile(file)}
                  >
                    {" "}
                    Delete
                  </span>
                </li>
              ))}
          {clickedCardDetail.attachments.length > 2 && (
            <div
              className="showAttachments"
              onClick={() => setShowAllAttachments(!showAllAttachments)}
            >
              <p>
                {showAllAttachments
                  ? "show fewer attachments"
                  : "view all attachments"}
              </p>
            </div>
          )}
          <div style={{ marginTop: "20px" }}>
            <label htmlFor="contained-button-file">
              <Input
                id="contained-button-file"
                type="file"
                onChange={(e) => {
                  handleUploadFile(e);
                }}
              />
              <Button variant="contained" component="span">
                Add Attachment
              </Button>
            </label>
          </div>
        </div>
      )}
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
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
              }}
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
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button color="primary" variant="contained" type="submit">
                    Save
                  </Button>
                  <label htmlFor="contained-button-file">
                    <Input
                      id="contained-button-file"
                      type="file"
                      onChange={(e) => {
                        handleUploadFile(e);
                      }}
                    />
                    <Button variant="contained" component="span">
                      Add Attachment
                    </Button>
                  </label>
                </div>
              )}
            </form>
          </div>
        </div>
        <div>
          {clickedCardDetail?.comments
            ?.slice()
            .reverse()
            .map?.((comment) => (
              <div style={{ display: "flex", gap: "10px" }} key={comment.id}>
                <Avatar alt="PM" className={classes.avatar}>
                  {comment?.commentBy[0]?.toUpperCase()}
                </Avatar>

                <div>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <h4>{comment.commentBy}</h4>
                    <small>{dayjs(comment.id).from(new Date())}</small>
                  </div>
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
  );
}

export default CardDetailsModal;
