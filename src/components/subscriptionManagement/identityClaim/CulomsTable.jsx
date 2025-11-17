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
    // {
    //   title: "Jury Vote",
    //   dataIndex: "jurorVote",
    //   key: "jurorVote",
    //   align: "center",
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    // },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        const ms = (record.machineStatus || record.status || "")
          .toString()
          .toLowerCase();

        return (
          <div className="flex justify-start gap-2">
            <Tooltip title="View Details">
              <Button
                type="primary"
                onClick={() => showPDFModal(record)}
                size="medium"
              >
                Details
              </Button>
            </Tooltip>

            {ms === "pending" && (
              <Tooltip title="Mark as Solved">
                <Button
                  onClick={() => directAccept(record, "review")}
                  size="medium"
                  style={{
                    backgroundColor: "#13c2c2",
                    borderColor: "#13c2c2",
                    color: "white",
                  }}
                >
                  Solved
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
};
