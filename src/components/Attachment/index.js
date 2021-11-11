import dayjs from "dayjs";
import React from "react";
import "./style.css";

function AttachmentDetail({
  file,
  handleDeleteFile,
  handleMakeCover,
  handleRemoveCover,
  cover,
}) {
  return (
    <div className="attachment_file">
      <a href={file.downloadURL} target="_blank">
        <p>{file.name}</p>
      </a>
      <small>Added {dayjs().calendar(dayjs(file.uploadedDate))}</small>
      <span> - </span>
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => handleDeleteFile(file)}
      >
        Delete
      </span>
      {file.isImage && (
        <span>
          {file.downloadURL !== cover ? (
            <>
              <span> - </span>
              <span
                onClick={() => handleMakeCover(file)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Make cover
              </span>
            </>
          ) : (
            <>
              <span> - </span>
              <span
                onClick={() => handleRemoveCover(file)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Remove cover
              </span>
            </>
          )}
        </span>
      )}
    </div>
  );
}

export default AttachmentDetail;
