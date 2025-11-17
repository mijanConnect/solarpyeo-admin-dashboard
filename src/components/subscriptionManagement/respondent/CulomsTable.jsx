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
      title: "Signature",
      dataIndex: "signature",
      key: "signature",
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

        // If rejected or completed, only show Details
        if (ms === "REJECTED" || ms === "APPROVED" || ms === "COMPLETED") {
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

        // If pending, show Details, Accept and Reject buttons
        if (ms === "PENDING") {
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

              <Tooltip title="Accept">
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
            </div>
          );
        }

        // Default fallback
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
      },
    },
  ];
};
