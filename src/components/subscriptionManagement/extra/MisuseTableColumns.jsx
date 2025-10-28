import { Button, Tag, Tooltip } from "antd";
import { sampleData as defaultSampleData, getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from '../data/sampleData';

export const MisuseTableColumns = (actionHandlers) => {
  const {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject,
    directAccept,
  } = actionHandlers;

  //   const handleRejectConfirm = (record) => {
  //     Modal.confirm({
  //       title: 'Are you sure?',
  //       content: 'Do you want to reject this submission?',
  //       okText: 'Yes, Reject',
  //       cancelText: 'Cancel',
  //       onOk() {
  //         handleReject(record);
  //       }
  //     });
  //   };

  return [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
    },
    {
      title: "Measus Name",
      dataIndex: "MeasusName",
      key: "MeasusName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Respondent Name",
      dataIndex: "respondentName",
      key: "respondentName",
      align: "center",
    },
    {
      title: "Case Type",
      dataIndex: "caseType",
      key: "caseType",
      align: "center",
    },
    {
      title: "Moderator Name",
      dataIndex: "moderatorName",
      key: "moderatorName",
      align: "center",
    },
    {
      title: "Jury Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
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
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          {/* PDF View Button */}
          <Tooltip title="View PDF">
            <Button
              type="primary"
              onClick={() => showPDFModal(record)}
              size="large"
            >
              Details
            </Button>
          </Tooltip>

          {/* Accept Button - Only for Pending/Running submissions */}
          {(record.status === "Running" || record.status === "Pending") && (
            <Tooltip title="Send to Jury">
              <Button
                onClick={() => directAccept(record)}
                size="large"
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

          {/* Final Review Button */}
          {record.status === "Final Review" && (
            <Tooltip title="Final Edit">
              <Button
                onClick={() => showEditModal(record)}
                size="large"
                style={{
                  backgroundColor: "#13c2c2",
                  borderColor: "#13c2c2",
                  color: "white",
                }}
              >
                Final Review
              </Button>
            </Tooltip>
          )}

          {/* Reject Button - Only if not rejected/finalized/sent */}
          {record.status === "Pending" && (
            <Tooltip title="Reject">
              <Button
                onClick={() => handleReject(record)}
                size="large"
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
      ),
    },
  ];
};

// Optional: transform raw data into the shape expected by Misuse table columns
export const MisuseTableData = (rawData = []) => {
  const source = rawData && rawData.length ? rawData : defaultSampleData;
  // Keep mapping centralised for misuse table variants
  return source.map((item) => ({
    ...item,
  }));
};
