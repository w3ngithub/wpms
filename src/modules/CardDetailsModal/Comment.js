import React from "react";
import { Button, styled } from "@material-ui/core";

import { MdLocalActivity } from "@react-icons/all-files/md/MdLocalActivity";
import Avatar from "react-avatar";
import dayjs from "dayjs";
import CommentPopover from "../../components/Popover";
import "./style.css";

const Input = styled("input")({
  display: "none",
});

function Comment({
  user,
  handleSubmitComment,
  setShowSaveComment,
  handleCommentToShowMember,
  commentToAdd,
  openCommentAddMemeberModal,
  members,
  commentMemebers,
  setOpenCommentAddMemeberModal,
  clickedCardDetail,
  commentToEdit,
  setCommentToEdit,
  openCommentAddMemebeEditrModal,
  setOpenCommentAddMemeberEditModal,
  handleAddMemberInComment,
  handleEditComment,
  handleDeleteComment,
  showSaveComment,
  handleUploadFile,
  boardUser,
}) {
  const showEditComment = (cmt) => {
    if (user.name === boardUser || user.name === cmt.commentBy) {
      return (
        <span
          className="comment_action"
          onClick={() => handleDeleteComment(cmt.id)}
        >
          Delete
        </span>
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <MdLocalActivity style={{ fontSize: "24px" }} />
        <h4>Activity</h4>
      </div>
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <Avatar name={user?.name} size={30} round />
          <form
            onSubmit={handleSubmitComment}
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              flex: "1",
            }}
            id="commentForm"
          >
            <div className={"comment_container"}>
              <textarea
                type="text"
                name="comment"
                placeholder="Write a comment..."
                className="comment"
                onFocus={() => setShowSaveComment(true)}
                onChange={(e) => handleCommentToShowMember(e)}
                value={commentToAdd}
              />
              {openCommentAddMemeberModal && (
                <CommentPopover
                  user={user}
                  members={members}
                  commentMemebers={commentMemebers}
                  onClose={() => setOpenCommentAddMemeberModal(false)}
                  handleAddMemberInComment={handleAddMemberInComment}
                />
              )}
            </div>
            {showSaveComment && (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  size="small"
                >
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
                  <Button variant="contained" component="span" size="small">
                    Add Attachment
                  </Button>
                </label>
              </div>
            )}
          </form>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        {clickedCardDetail?.comments
          ?.slice()
          .reverse()
          .map?.((comment) => (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
              key={comment.id}
            >
              <Avatar name={comment?.commentBy} size={30} round />

              <div style={{ flex: "1" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <p style={{ fontWeight: "700", fontSize: "14px" }}>
                    {comment.commentBy}
                  </p>
                  <small>{dayjs(comment.id).from(new Date())}</small>
                </div>
                {commentToEdit.editComment &&
                commentToEdit.id === comment.id ? (
                  <div className="edit_comment_form">
                    <textarea
                      className="comment"
                      type="text"
                      value={commentToEdit.comment}
                      onChange={(e) =>
                        setCommentToEdit({
                          ...commentToEdit,
                          comment: e.target.value,
                        })
                      }
                    />
                    {openCommentAddMemebeEditrModal && (
                      <CommentPopover
                        user={user}
                        members={members}
                        commentMemebers={commentMemebers}
                        onClose={() => setOpenCommentAddMemeberEditModal(false)}
                        action="edit"
                        handleAddMemberInComment={handleAddMemberInComment}
                      />
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        onClick={handleEditComment}
                      >
                        Save
                      </Button>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => setCommentToEdit({ editComment: false })}
                      >
                        X
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="comment">
                      {comment.comment
                        .split(" ")
                        .map((c, i) =>
                          c[0] === "@" ? (
                            <strong key={i}> {c} </strong>
                          ) : (
                            <span key={i}> {c} </span>
                          )
                        )}
                    </div>
                    <div style={{ marginTop: "7px" }}>
                      {user.name === comment.commentBy && (
                        <span
                          className="comment_action"
                          onClick={() =>
                            setCommentToEdit({
                              ...comment,
                              editComment: true,
                            })
                          }
                        >
                          Edit -
                        </span>
                      )}{" "}
                      {showEditComment(comment)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Comment;
