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
      <a
        href={file.downloadURL}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: "none" }}
      >
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
          <div className="attachment_file_name">
            {file?.name?.split(".")?.[1]}
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
          <div>
            <a
              href={file.downloadURL}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
              }}
            >
              {file.name}
            </a>
          </div>
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
