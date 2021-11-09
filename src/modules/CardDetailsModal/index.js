import React, { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Popover,
  styled,
  TextField,
} from "@material-ui/core";
import { MdLocalActivity } from "@react-icons/all-files/md/MdLocalActivity";
import { MdSubtitles } from "@react-icons/all-files/md/MdSubtitles";
import EditableTextField from "../../components/EditableTextField";
import { CgDetailsMore } from "@react-icons/all-files/cg/CgDetailsMore";
import { ImAttachment } from "@react-icons/all-files/im/ImAttachment";
import { GoChecklist } from "@react-icons/all-files/go/GoChecklist";
import { MdCancel } from "@react-icons/all-files/md/MdCancel";
import ProgressBar from "@ramonak/react-progress-bar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { updateBoard } from "../../api-config/boards";
import { removeFile, uploadFile } from "../../api-config/uploadFile";
import "./style.css";
import Notification from "../../components/Notification";
import { CheckBox } from "@material-ui/icons";

dayjs.extend(relativeTime);

const labelColor = {
  backgroundColor: "#fff",
  position: "absolute",
  top: "10%",
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
  const [validFile, setValidFile] = useState(false);
  const [checklistIdToaddItem, sertCheckListToaddItem] = useState("");

  const oneditCardTitleChange = (e) => seteditCardTitle(e.target.value);
  const oneEditCardDetailChange = (e) => seteditCardDetail(e.target.value);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const handleSubmitCheckListTitle = async (e) => {
    e.preventDefault();
    const title = e.target.checklistTitle.value;
    if (title) {
      const updatedCardData = data.lanes.map((lane) =>
        lane.id === clickedCardDetail.laneId
          ? {
              ...lane,
              cards: lane.cards.map((card) =>
                card.id === clickedCardDetail.id
                  ? {
                      ...card,
                      checklist: [
                        ...(card.checklist || ""),
                        { id: Date.now(), title: title, list: [] },
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
      document.getElementById("checklisttitle").reset();
      handleClosePopOver();
    }
  };

  const handleUploadFile = (e) => {
    const validFiles = ["application", "image", "video"];
    if (validFiles.includes(e.target.files[0].type.split("/")[0])) {
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
      setValidFile(false);
    } else {
      setValidFile(true);
    }
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

  const handleClickAddListItem = (checklistId) => {
    sertCheckListToaddItem(checklistId);
  };

  const handleSubmitAddItemTocheckList = async (e) => {
    e.preventDefault();
    const item = e.target.checklistitem.value;
    if (item) {
      const updatedCardData = data.lanes.map((lane) =>
        lane.id === clickedCardDetail.laneId
          ? {
              ...lane,
              cards: lane.cards.map((card) =>
                card.id === clickedCardDetail.id
                  ? {
                      ...card,
                      checklist: card.checklist.map((check) =>
                        check.id === checklistIdToaddItem
                          ? {
                              ...check,
                              list: [
                                ...(check.list || ""),
                                { item: item, check: false, id: Date.now() },
                              ],
                            }
                          : check
                      ),
                    }
                  : card
              ),
            }
          : lane
      );
      await updateBoard(projectId, "lanes", updatedCardData);
      e.target.checklistitem.value = "";
      handleCardClick(
        clickedCardDetail.id,
        null,
        clickedCardDetail.laneId,
        "special"
      );
    }
  };

  const handleDeleteCheckList = async (checklistId) => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    checklist: card.checklist.filter(
                      (check) => check.id !== checklistId
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
  };

  const handleChangeCheckListItemChecked = async (
    checked,
    itemId,
    checkListId
  ) => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    checklist: card.checklist.map((c) =>
                      c.id === checkListId
                        ? {
                            ...c,
                            list: c.list.map((l) =>
                              l.id === itemId ? { ...l, check: checked } : l
                            ),
                          }
                        : c
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
  };

  return (
    <>
      <div className="modal_container" style={{ ...labelColor }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
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
                  data?.lanes?.find(
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
          {clickedCardDetail.attachments &&
            clickedCardDetail.attachments.length && (
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
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
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
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
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

          {clickedCardDetail.checklist &&
            clickedCardDetail.checklist.length !== 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {clickedCardDetail.checklist.map((list) => (
                  <div
                    key={list.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h3>
                        <GoChecklist />
                        {list.title}
                      </h3>
                      <div
                        className="add_to_cart"
                        style={{
                          maxWidth: "80px",
                        }}
                        onClick={() => handleDeleteCheckList(list.id)}
                      >
                        Delete
                      </div>
                    </div>
                    <ProgressBar
                      completed={
                        (list.list.filter((l) => l.check === true).length /
                          list.list.length) *
                        100
                      }
                      bgColor="#61BD4F"
                      height="12px"
                    />
                    {list?.list?.map?.((item) => (
                      <FormControlLabel
                        key={item.id}
                        control={
                          <Checkbox
                            checked={item.check}
                            onChange={() =>
                              handleChangeCheckListItemChecked(
                                !item.check,
                                item.id,
                                list.id
                              )
                            }
                          />
                        }
                        label={item.item}
                      />
                    ))}
                    {list.id !== checklistIdToaddItem ? (
                      <div
                        className="add_to_cart"
                        style={{ maxWidth: "110px" }}
                        onClick={() => handleClickAddListItem(list.id)}
                      >
                        Add an item
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitAddItemTocheckList}>
                        <TextField
                          id="outlined-basic"
                          label="Add an Item"
                          variant="outlined"
                          name="checklistitem"
                          fullWidth
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            type="submit"
                          >
                            Add
                          </Button>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => sertCheckListToaddItem("")}
                          >
                            <h3>
                              <MdCancel />
                            </h3>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
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
                  <div
                    style={{ display: "flex", gap: "10px" }}
                    key={comment.id}
                  >
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
          <Notification
            message="Invalid file"
            open={validFile}
            setOpen={setValidFile}
          />
        </div>
        <div className="card_options">
          <h5>Add to cart</h5>
          <div className="add_to_cart">Labels</div>
          <div className="add_to_cart" id={id} onClick={handleClickPopOver}>
            CheckList
          </div>
        </div>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopOver}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          style={{
            width: "300px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              borderBottom: "2px solid rgba(0, 0, 0, 0.23)",
              marginBottom: "15px",
              padding: "0 10px 10px 0",
            }}
          >
            <p>Add Checklist</p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "9px",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={handleClosePopOver}
          >
            x
          </div>
          <p>Title</p>
          <form onSubmit={handleSubmitCheckListTitle} id="checklisttitle">
            <TextField
              id="outlined-basic"
              label="Checklist"
              variant="outlined"
              name="checklistTitle"
              fullWidth
            />
            <Button variant="contained" fullWidth color="primary" type="submit">
              Add
            </Button>
          </form>
        </div>
      </Popover>
    </>
  );
}

export default CardDetailsModal;
