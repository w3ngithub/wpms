import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Popover,
  styled,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { MdSubtitles } from "@react-icons/all-files/md/MdSubtitles";
import EditableTextField from "../../components/EditableTextField";
import { CgDetailsMore } from "@react-icons/all-files/cg/CgDetailsMore";
import { ImAttachment } from "@react-icons/all-files/im/ImAttachment";
import { GoChecklist } from "@react-icons/all-files/go/GoChecklist";
import { MdCancel } from "@react-icons/all-files/md/MdCancel";
import { AiOutlineShareAlt } from "@react-icons/all-files/ai/AiOutlineShareAlt";
import { BsCardChecklist } from "@react-icons/all-files/bs/BsCardChecklist";
import LabelIcon from "@material-ui/icons/Label";
import PaletteIcon from "@material-ui/icons/Palette";
import { GrAdd } from "@react-icons/all-files/gr/GrAdd";
import ProgressBar from "@ramonak/react-progress-bar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { addNewLabelsToBoard, updateBoard } from "../../api-config/boards";
import { removeFile, uploadFile } from "../../api-config/uploadFile";
import Notification from "../../components/Notification";
import AttachmentDetail from "../../components/Attachment";
import AddCardColor from "./AddCardColor";
import AddCardLabels from "./AddCardLabels";
import ShareCard from "./ShareCard";
import Comment from "./Comment";
import AddCardChecklist from "./AddCardChecklist";

import "./style.css";

dayjs.extend(relativeTime);

const Input = styled("input")({
  display: "none",
});

function CardDetailsModal({
  clickedCardDetail,
  data,
  boardUser,
  handleCardClick,
  projectId,
  user,
  seteditCardTitle,
  seteditCardDetail,
  editCardTitle,
  editCardDetail,
  boardLabels,
  onClose,
  members = [],
}) {
  const [showSaveComment, setShowSaveComment] = useState(false);

  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const [validFile, setValidFile] = useState(false);
  const [checklistIdToaddItem, sertCheckListToaddItem] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE4, setAnchorE4] = useState(null);

  const [labelToSearch, setLabelToSearch] = useState("");
  const [newLabel, setNewLabel] = useState(false);
  const [newlabelColor, setLabelColor] = useState({ hex: "#C0C6CF" });
  const [filteredBoardLabels, setFilteredBoardLables] = useState([]);
  const [commentToEdit, setCommentToEdit] = useState({ editComment: false });
  const [openCommentAddMemeberModal, setOpenCommentAddMemeberModal] =
    useState(false);
  const [openCommentAddMemebeEditrModal, setOpenCommentAddMemeberEditModal] =
    useState(false);
  const [commentMemebers, setCommentMemebers] = useState([]);
  const [commentToAdd, setCommentToAdd] = useState("");
  const [tagToAdd, setTagToAdd] = useState([]);
  const [progress, setProgess] = useState(0);
  const [isprogressOpen, setProgressOpen] = useState(false);

  const oneditCardTitleChange = (e) => seteditCardTitle(e.target.value);
  const oneEditCardDetailChange = (e) => seteditCardDetail(e.target.value);

  useEffect(() => {
    if (labelToSearch) {
      setFilteredBoardLables(
        boardLabels?.filter((label) => label?.name?.includes(labelToSearch)) ||
          []
      );
    } else {
      setFilteredBoardLables(boardLabels);
    }
  }, [labelToSearch, boardLabels]);

  useEffect(() => {
    if (commentToEdit.comment) {
      const commentInput = commentToEdit.comment.split(" ");
      // setCommentToAdd(commentToEdit.comment);
      const hasSpecialLletter = commentInput.find((val) => val[0] === "@");
      if (
        hasSpecialLletter &&
        hasSpecialLletter.length > 1 &&
        [boardUser, ...members].filter((name) =>
          name.includes(hasSpecialLletter.substring(1))
        ).length > 0
      ) {
        setCommentMemebers(
          [...members, boardUser].filter((name) =>
            name
              .toLowerCase()
              .includes(hasSpecialLletter.substring(1).toLowerCase())
          )
        );
        setOpenCommentAddMemeberEditModal(true);
      } else {
        setOpenCommentAddMemeberEditModal(false);
      }
    }
  }, [commentToEdit.comment, boardUser, members]);

  const handleClickPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const handleClickSharePopOver = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleCloseSharePopOver = () => {
    setAnchorE2(null);
  };

  const handleClickLabelPopOver = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleCloseLabelPopOver = () => {
    setAnchorE3(null);
  };

  const handleClickCardColor = (event) => {
    setAnchorE4(event.currentTarget);
  };

  const handleCloseCardColor = () => {
    setAnchorE4(null);
  };

  const open = Boolean(anchorEl);
  const openShare = Boolean(anchorE2);
  const openLabel = Boolean(anchorE3);
  const openCardColor = Boolean(anchorE4);

  const id = open ? "simple-popover" : undefined;
  const idShare = openShare ? "simple-popover" : undefined;
  const idLabel = openLabel ? "simple-popover" : undefined;
  const idCardColor = openCardColor ? "simple-popover" : undefined;

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
                        comment: commentToAdd,
                        id: Date.now(),
                        tags: [...tagToAdd],
                      },
                    ],
                  }
                : card
            ),
          }
        : lane
    );
    await updateBoard(projectId, "lanes", updatedCardData);
    setCommentToAdd("");
    setTagToAdd([]);
    handleCardClick(
      clickedCardDetail.id,
      null,
      clickedCardDetail.laneId,
      "special"
    );
  };

  const handleDeleteComment = async (commentId) => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    comments: card?.comments.filter(
                      (comment) => comment.id !== commentId
                    ),
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

  const handleEditComment = async () => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    comments: card?.comments.map((cmt) =>
                      cmt.id === commentToEdit.id
                        ? {
                            ...cmt,
                            comment: commentToEdit.comment,
                            tags: [...tagToAdd, ...cmt.tags],
                          }
                        : cmt
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
    setTagToAdd([]);
    setCommentToEdit({ editComment: false });
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
          setProgess(progress);
          setProgressOpen(true);
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
                              {
                                downloadURL,
                                name: e.target.files[0].name,
                                uploadedDate: Date.now(),
                                isImage:
                                  e.target.files[0].type.split("/")[0] ===
                                  "image"
                                    ? true
                                    : false,
                              },
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

  const handleSetCardColor = async (color) => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    style: { backgroundColor: color.hex },
                  }
                : card
            ),
          }
        : lane
    );
    handleCloseCardColor();
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

  const handleSubmitNewLabel = async (e) => {
    e.preventDefault();
    const newLabel = e.target.newLabelName.value;
    if (newLabel) {
      const updatedCardData = data.lanes.map((lane) =>
        lane.id === clickedCardDetail.laneId
          ? {
              ...lane,
              cards: lane.cards.map((card) =>
                card.id === clickedCardDetail.id
                  ? {
                      ...card,
                      labels: [
                        ...(card.labels || ""),
                        { name: newLabel, color: newlabelColor?.hex },
                      ],
                    }
                  : card
              ),
            }
          : lane
      );
      await updateBoard(projectId, "lanes", updatedCardData);
      addNewLabelsToBoard(projectId, {
        name: newLabel || "",
        color: newlabelColor.hex,
      });

      handleCloseLabelPopOver();
      handleCardClick(
        clickedCardDetail.id,
        null,
        clickedCardDetail.laneId,
        "special"
      );
      setNewLabel(false);
    }
  };

  const handleAddLabelFromBoardLabel = async (label) => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    labels: [...(card.labels || ""), label],
                  }
                : card
            ),
          }
        : lane
    );
    await updateBoard(projectId, "lanes", updatedCardData);

    handleCloseLabelPopOver();
    handleCardClick(
      clickedCardDetail.id,
      null,
      clickedCardDetail.laneId,
      "special"
    );
  };

  const handleMakeCover = async (file) => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    coverImage: file.downloadURL,
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

  const handleRemoveCover = async () => {
    const updatedCardData = data.lanes.map((lane) =>
      lane.id === clickedCardDetail.laneId
        ? {
            ...lane,
            cards: lane.cards.map((card) =>
              card.id === clickedCardDetail.id
                ? {
                    ...card,
                    coverImage: "",
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

  const handleCommentToShowMember = (e) => {
    const commentInput = e.target.value.split(" ");
    setCommentToAdd(e.target.value);
    const hasSpecialLletter = commentInput.find((val) => val[0] === "@");
    if (
      hasSpecialLletter &&
      hasSpecialLletter.length > 1 &&
      [boardUser, ...members].filter((name) =>
        name.includes(hasSpecialLletter.substring(1))
      ).length > 0
    ) {
      setCommentMemebers(
        [...members, boardUser].filter((name) =>
          name
            .toLowerCase()
            .includes(hasSpecialLletter.substring(1).toLowerCase())
        )
      );
      setOpenCommentAddMemeberModal(true);
    } else {
      setOpenCommentAddMemeberModal(false);
    }
  };

  const handleAddMemberInComment = (comment, action = "Add") => {
    if (action === "Add") {
      setCommentToAdd(
        commentToAdd
          .split(" ")
          .map((c) => (c[0] === "@" ? c[0] : c))
          .join(" ") + comment.split(" ").join("")
      );

      setOpenCommentAddMemeberModal(false);
    } else {
      setCommentToEdit({
        ...commentToEdit,
        comment:
          commentToEdit?.comment
            ?.split(" ")
            .map((c) => (c[0] === "@" ? c[0] : c))
            .join(" ") + comment.split(" ").join(""),
      });
    }
    setTagToAdd([
      ...tagToAdd,
      { user: comment, tag: comment.split(" ").join("") },
    ]);
  };

  return (
    <>
      <div className="modal_container">
        <div className="modal_close" onClick={onClose}>
          <CloseIcon style={{ fontSize: "18px" }} />
        </div>
        {clickedCardDetail.coverImage && clickedCardDetail.coverImage !== "" && (
          <div style={{ width: "100%" }}>
            <img
              className="cover_image"
              src={clickedCardDetail.coverImage}
              alt="Card Cover"
            />
          </div>
        )}
        <div className="card_content">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              flex: "1",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              <div>
                <MdSubtitles style={{ fontSize: "24px" }} />
              </div>
              <div>
                <EditableTextField
                  oldTitle={clickedCardDetail.title}
                  title={editCardTitle || clickedCardDetail.title}
                  onChange={oneditCardTitleChange}
                  save={onSaveeditCardTitle}
                  style={{ minWidth: "230px", color: "#000" }}
                />
                <p style={{ marginTop: "10px" }}>
                  in list{" "}
                  {
                    data?.lanes?.find(
                      (lane) => lane.id === clickedCardDetail?.laneId
                    )?.title
                  }
                </p>
              </div>
            </div>
            {clickedCardDetail.labels && clickedCardDetail.labels.length !== 0 && (
              <div
                style={{ display: "flex", alignItems: "baseline", gap: "10px" }}
              >
                <div>
                  <p style={{ marginBottom: "5px" }}>Labels</p>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {clickedCardDetail.labels.map((label, i) => (
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: label.color,
                          borderRadius: "8px",
                          display: "inline-block",
                          height: "40px",
                          color: "#fff",
                        }}
                        key={i}
                      >
                        {label.name}
                      </div>
                    ))}
                    <div
                      className="add_to_cart"
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        display: "inline-block",
                        height: "40px",
                        cursor: "pointer",
                      }}
                      id={idLabel}
                      onClick={handleClickLabelPopOver}
                    >
                      <GrAdd />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "10px",
                marginTop: "5px",
              }}
            >
              <div>
                <CgDetailsMore style={{ fontSize: "24px" }} />
              </div>
              <div style={{ width: "100%" }}>
                <h4 style={{ marginBottom: "10px" }}>Description</h4>
                <EditableTextField
                  oldTitle={clickedCardDetail.description}
                  title={editCardDetail || clickedCardDetail.description}
                  onChange={oneEditCardDetailChange}
                  save={onSaveeditCardDetail}
                  style={{
                    width: "100%",
                    fontSize: "14px",
                    color: "#000",
                    fontWeight: "400",
                  }}
                  bigInput={true}
                />
              </div>
            </div>
            {clickedCardDetail.attachments &&
              clickedCardDetail.attachments.length !== 0 && (
                <div>
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <ImAttachment />
                    <span>Attachment</span>
                  </h4>
                  {showAllAttachments
                    ? clickedCardDetail?.attachments?.map((file) => (
                        <AttachmentDetail
                          key={file.downloadURL}
                          file={file}
                          handleDeleteFile={handleDeleteFile}
                          handleMakeCover={handleMakeCover}
                          handleRemoveCover={handleRemoveCover}
                          cover={clickedCardDetail.coverImage}
                        />
                      ))
                    : clickedCardDetail?.attachments
                        ?.slice(0, 2)
                        .map((file) => (
                          <AttachmentDetail
                            key={file.downloadURL}
                            file={file}
                            handleDeleteFile={handleDeleteFile}
                            handleMakeCover={handleMakeCover}
                            handleRemoveCover={handleRemoveCover}
                            cover={clickedCardDetail.coverImage}
                          />
                        ))}
                  {clickedCardDetail.attachments.length > 2 && (
                    <div
                      className="showAttachments"
                      onClick={() => setShowAllAttachments(!showAllAttachments)}
                    >
                      <p style={{ fontSize: "14px" }}>
                        {showAllAttachments
                          ? "Show fewer attachments"
                          : `View all attachments (${
                              clickedCardDetail?.attachments?.length - 2
                            } hidden)`}
                      </p>
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: "10px",
                      display: "inline-block",
                    }}
                  >
                    <label htmlFor="contained-button-file">
                      <Input
                        id="contained-button-file"
                        type="file"
                        onChange={(e) => {
                          handleUploadFile(e);
                        }}
                      />
                      <div className="add_to_cart">Add an Attachment</div>
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
                          alignItems: "center",
                        }}
                      >
                        <h4
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <GoChecklist style={{ fontSize: "22px" }} />
                          <span>{list.title}</span>
                        </h4>
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
                          list.list.length !== 0
                            ? (list?.list.filter((l) => l.check === true)
                                .length /
                                list?.list?.length) *
                              100
                            : 0
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
            <Comment
              user={user}
              handleSubmitComment={handleSubmitComment}
              setShowSaveComment={setShowSaveComment}
              handleCommentToShowMember={handleCommentToShowMember}
              commentToAdd={commentToAdd}
              openCommentAddMemeberModal={openCommentAddMemeberModal}
              members={members}
              commentMemebers={commentMemebers}
              setOpenCommentAddMemeberModal={setOpenCommentAddMemeberModal}
              clickedCardDetail={clickedCardDetail}
              commentToEdit={commentToEdit}
              setCommentToEdit={setCommentToEdit}
              openCommentAddMemebeEditrModal={openCommentAddMemebeEditrModal}
              setOpenCommentAddMemeberEditModal={
                setOpenCommentAddMemeberEditModal
              }
              handleAddMemberInComment={handleAddMemberInComment}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              showSaveComment={showSaveComment}
              handleUploadFile={handleUploadFile}
              boardUser={boardUser}
            />
            <Notification
              message="Invalid file"
              open={validFile}
              setOpen={setValidFile}
            />
          </div>
          <div className="card_options">
            <div className="card_options">
              <h5>Add to card</h5>
              <div
                className="add_to_cart"
                id={idLabel}
                onClick={handleClickLabelPopOver}
                style={{
                  padding: "10px 20px 10px 10px",
                  // justifyContent: "space-between",
                }}
              >
                <LabelIcon />
                <span>Labels</span>
              </div>
              <div
                className="add_to_cart"
                id={id}
                onClick={handleClickPopOver}
                style={{
                  padding: "10px 20px 10px 10px",
                  // justifyContent: "space-between",
                }}
              >
                <BsCardChecklist />
                <span>CheckList</span>{" "}
              </div>
              <div
                className="add_to_cart"
                id={idCardColor}
                onClick={handleClickCardColor}
                style={{
                  padding: "10px 20px 10px 10px",
                  // justifyContent: "space-between",
                }}
              >
                <PaletteIcon />

                <span>Background</span>
              </div>
            </div>
            <div className="card_options">
              <h5>Actions</h5>
              <div
                className="add_to_cart"
                id={handleClickSharePopOver}
                onClick={handleClickSharePopOver}
                style={{
                  padding: "10px 20px 10px 10px",
                  // justifyContent: "space-between",
                }}
              >
                <AiOutlineShareAlt />
                <span>Share</span>
              </div>
            </div>
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
        <AddCardChecklist
          handleClosePopOver={handleClosePopOver}
          handleSubmitCheckListTitle={handleSubmitCheckListTitle}
        />
      </Popover>
      <Popover
        id={idShare}
        open={openShare}
        anchorEl={anchorE2}
        onClose={handleCloseSharePopOver}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ShareCard handleCloseSharePopOver={handleCloseSharePopOver} />
      </Popover>
      <Popover
        id={idLabel}
        open={openLabel}
        anchorEl={anchorE3}
        onClose={handleCloseLabelPopOver}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <AddCardLabels
          handleCloseLabelPopOver={handleCloseLabelPopOver}
          newLabel={newLabel}
          newlabelColor={newlabelColor}
          setLabelColor={setLabelColor}
          handleSubmitNewLabel={handleSubmitNewLabel}
          labelToSearch={labelToSearch}
          setLabelToSearch={setLabelToSearch}
          boardLabels={boardLabels}
          filteredBoardLabels={filteredBoardLabels}
          handleAddLabelFromBoardLabel={handleAddLabelFromBoardLabel}
          setNewLabel={setNewLabel}
        />
      </Popover>
      <Popover
        id={idCardColor}
        open={openCardColor}
        anchorEl={anchorE4}
        onClose={handleCloseCardColor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <AddCardColor
          handleCloseCardColor={handleCloseCardColor}
          handleSetCardColor={handleSetCardColor}
        />
      </Popover>
      {progress !== 100 ? (
        <Notification
          message={`Upload processing... ${Math.floor(progress)}% completed`}
          open={isprogressOpen}
          setOpen={setProgressOpen}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        />
      ) : (
        <Notification
          message="Upload completed"
          open={isprogressOpen}
          setOpen={setProgressOpen}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        />
      )}
    </>
  );
}

export default CardDetailsModal;
