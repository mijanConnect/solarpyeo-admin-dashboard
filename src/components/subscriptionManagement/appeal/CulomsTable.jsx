import { Button, Tag, Tooltip } from "antd";
import { getStatusColor } from "./sampleData";

export const TableColumns = (actionHandlers) => {
  const {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject,
    directAccept,
  } = actionHandlers;

  return [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
    },
    {
      title: "Initiator Name",
      dataIndex: "initiatorName",
      key: "initiatorName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Review Option",
      dataIndex: "reviewOption",
      key: "reviewOption",
      align: "center",
    },
    // {
    //   title: "Jury Vote",
    //   dataIndex: "jurorVote",
    //   key: "jurorVote",
    //   align: "center",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        // Prefer machineStatus (server value) for logic; fall back to human status
        const ms = (record.machineStatus || record.status || "")
          .toString()
          .toUpperCase();
        const jurorCount = Number(record.jurorCount || 0);

        const id = record?._id;

        // If rejected, only show Details
        if (ms === "REJECTED") {
          return (
            <div className="flex justify-start gap-2">
              <Tooltip title="View PDF">
                <Button
                  type="primary"
                  onClick={() => showPDFModal(record)}
                  size="medium"
                >
                  Details
                </Button>
              </Tooltip>
            </div>
          );
        }

        return (
          <div className="flex justify-start gap-2">
            {/* PDF View Button - always available */}
            <Tooltip title="View PDF">
              <Button
                type="primary"
                onClick={() => showPDFModal(record)}
                size="medium"
              >
                Details
              </Button>
            </Tooltip>

            {/* If jurorCount >= 3 show Final Review */}
            {/* {jurorCount >= 3 && (
              <Tooltip title="Final Edit">
                <Button
                  onClick={() => showEditModal(record)}
                  size="medium"
                  style={{
                    backgroundColor: "#13c2c2",
                    borderColor: "#13c2c2",
                    color: "white",
                  }}
                >
                  Final Review
                </Button>
              </Tooltip>
            )} */}

            {/* Show Accept (send to jury) for PENDING, APPROVED, REVIEW */}
            {(ms === "PENDING" || ms === "REVIEW") && jurorCount < 3 && (
              <Tooltip title="Send to Jury">
                <Button
                  onClick={() => directAccept(record, "APPROVED")}
                  size="medium"
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "white",
                  }}
                >
                  Accept
                </Button>
              </Tooltip>
            )}

            {/* If APPROVED show Under Jury Review button */}
            {/* {ms === "APPROVED" && jurorCount < 3 && (
              <Tooltip title="Under Jury Review">
                <Button
                  onClick={() => directAccept(record, "UNDER_JURY_REVIEW")}
                  size="medium"
                  disabled={true}
                  style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                    color: "white",
                  }}
                >
                  Under Jury Review
                </Button>
              </Tooltip>
            )} */}

            {/* Reject Button - only when pending */}
            {ms === "PENDING" && (
              <Tooltip title="Reject">
                <Button
                  onClick={() => handleReject(record)}
                  size="medium"
                  style={{
                    backgroundColor: "#f5222d",
                    borderColor: "#f5222d",
                    color: "white",
                  }}
                >
                  Reject
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
};
