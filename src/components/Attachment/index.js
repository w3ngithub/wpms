import React from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import "./style.css";

dayjs.extend(LocalizedFormat);

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
        {file.isImage ? (
          <img
            src={file.downloadURL}
            alt=""
            style={{
              objectFit: "contain",
              height: "70px",
              width: "100px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          />
        ) : (
          <div
            style={{
              height: "70px",
              backgroundColor: "#ffff",
              borderRadius: "10px",
              padding: "5px",
              width: "100px",
              textDecoration: "none",
              color: "black",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {file.name}
          </div>
        )}
      </a>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <a href={file.downloadURL} target="_blank">
          {file.name}
        </a>
        <small>Added {dayjs(file.uploadedDate).format("LLL")}</small>
      </div>
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
