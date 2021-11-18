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
      <a href={file.downloadURL} target="_blank" rel="noreferrer">
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
        <div>
          <a href={file.downloadURL} target="_blank" rel="noreferrer">
            {file.name}
          </a>
          <small> Added {dayjs(file.uploadedDate).format("LLL")}</small>
          <span> - </span>
          <span
            className="attachment_actions"
            onClick={() => handleDeleteFile(file)}
          >
            Delete
          </span>
        </div>
        <div>
          {file.isImage && (
            <span>
              {file.downloadURL !== cover ? (
                <>
                  <span
                    onClick={() => handleMakeCover(file)}
                    className="attachment_actions"
                  >
                    Make cover
                  </span>
                </>
              ) : (
                <>
                  <span
                    onClick={() => handleRemoveCover(file)}
                    className="attachment_actions"
                  >
                    Remove cover
                  </span>
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttachmentDetail;
