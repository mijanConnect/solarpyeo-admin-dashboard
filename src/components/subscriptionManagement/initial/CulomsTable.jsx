// import { Button, Tag, Tooltip } from "antd";
// import { getStatusColor } from "./sampleData";

// export const TableColumns = (actionHandlers) => {
//   const {
//     showPDFModal,
//     showAcceptModal,
//     showJuryModal,
//     showEditModal,
//     handleReject,
//     directAccept,
//   } = actionHandlers;

//   return [
//     {
//       title: "SL",
//       dataIndex: "id",
//       key: "id",
//       align: "center",
//       width: 60,
//     },
//     {
//       title: "Initiator Name",
//       dataIndex: "initiatorName",
//       key: "initiatorName",
//       align: "center",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       align: "center",
//     },
//     {
//       title: "Respondent Name",
//       dataIndex: "respondentName",
//       key: "respondentName",
//       align: "center",
//     },
//     {
//       title: "Case ID",
//       dataIndex: "caseId",
//       key: "caseId",
//       align: "center",
//     },
//     // {
//     //   title: "Moderator Name",
//     //   dataIndex: "moderatorName",
//     //   key: "moderatorName",
//     //   align: "center",
//     // },
//     {
//       title: "Jury Vote",
//       dataIndex: "jurorVote",
//       key: "jurorVote",
//       align: "center",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       align: "center",
//       render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
//     },
//     {
//       title: "Action",
//       key: "action",
//       align: "start",
//       width: 100,
//       render: (_, record) => {
//         // Prefer machineStatus (server value) for logic; fall back to human status
//         const ms = (record.machineStatus || record.status || "")
//           .toString()
//           .toUpperCase();
//         const jurorCount = Number(record.jurorCount || 0);

//         const id = record?._id;

//         // If rejected, only show Details
//         if (ms === "REJECTED") {
//           return (
//             <div className="flex justify-start gap-2">
//               <Tooltip title="View PDF">
//                 <Button
//                   type="primary"
//                   onClick={() => showPDFModal(record)}
//                   size="medium"
//                 >
//                   Details
//                 </Button>
//               </Tooltip>
//             </div>
//           );
//         }

//         return (
//           <div className="flex justify-start gap-2">
//             {/* PDF View Button - always available */}
//             <Tooltip title="View PDF">
//               <Button
//                 type="primary"
//                 onClick={() => showPDFModal(record)}
//                 size="medium"
//               >
//                 Details
//               </Button>
//             </Tooltip>

//             {/* If jurorCount >= 3 show Final Review */}
//             {jurorCount >= 3 && (
//               <Tooltip title="Final Edit">
//                 <Button
//                   onClick={() => showEditModal(record)}
//                   size="medium"
//                   style={{
//                     backgroundColor: "#13c2c2",
//                     borderColor: "#13c2c2",
//                     color: "white",
//                   }}
//                 >
//                   Final Review
//                 </Button>
//               </Tooltip>
//             )}

//             {/* Show Accept (send to jury) for PENDING, APPROVED, REVIEW */}
//             {(ms === "PENDING" || ms === "REVIEW") && jurorCount < 3 && (
//               <Tooltip title="Send to Jury">
//                 <Button
//                   onClick={() => directAccept(record, "APPROVED")}
//                   size="medium"
//                   style={{
//                     backgroundColor: "#52c41a",
//                     borderColor: "#52c41a",
//                     color: "white",
//                   }}
//                 >
//                   Send to Jury
//                 </Button>
//               </Tooltip>
//             )}

//             {/* If APPROVED show Juror Review button (disabled indicator) */}
//             {ms === "APPROVED" && jurorCount < 3 && (
//               <Tooltip title="Juror Review">
//                 <Button
//                   onClick={() => directAccept(record, "UNDER_JURY_REVIEW")}
//                   size="medium"
//                   disabled={true}
//                   style={{
//                     backgroundColor: "#1890ff",
//                     borderColor: "#1890ff",
//                     color: "white",
//                   }}
//                 >
//                   Juror Review
//                 </Button>
//               </Tooltip>
//             )}

//             {/* Reject Button - only when pending */}
//             {ms === "PENDING" && (
//               <Tooltip title="Reject">
//                 <Button
//                   onClick={() => handleReject(record)}
//                   size="medium"
//                   style={{
//                     backgroundColor: "#f5222d",
//                     borderColor: "#f5222d",
//                     color: "white",
//                   }}
//                 >
//                   Reject
//                 </Button>
//               </Tooltip>
//             )}
//           </div>
//         );
//       },
//     },
//   ];
// };

import { Button, Tag, Tooltip } from "antd";
import { getStatusColor } from "./sampleData";
import { render } from "react-dom";

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
      title: "Respondent Name",
      dataIndex: "respondentName",
      key: "respondentName",
      align: "center",
    },
    {
      title: "Case ID",
      dataIndex: "caseId",
      key: "caseId",
      align: "center",
    },
    // {
    //   title: "Moderator Name",
    //   dataIndex: "moderatorName",
    //   key: "moderatorName",
    //   align: "center",
    // },
    {
      title: "Jury Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (priority) => {
        const color = priority === "EXPEDITED" ? "red" : "blue";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        // If backend status is APPROVED, show Completed
        const backendStatus = record.machineStatus || "";
        const displayStatus =
          backendStatus === "APPROVED" ? "Completed" : status;
        return <Tag color={getStatusColor(displayStatus)}>{displayStatus}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "start",
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

            {/* Show Final Review if jurorCount >= 3 and no admin decision provided */}
            {jurorCount >= 3 && !record.hasAdminDecision && (
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
            )}

            {/* Show Accept (send to jury) for PENDING only */}
            {ms === "PENDING" && jurorCount < 3 && (
              <Tooltip title="Send to Jury">
                <Button
                  onClick={() => directAccept(record, "REVIEW")}
                  size="medium"
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "white",
                  }}
                >
                  Send to Jury
                </Button>
              </Tooltip>
            )}

            {/* If APPROVED or REVIEW show Juror Review button (disabled indicator) */}
            {(ms === "APPROVED" || ms === "REVIEW") && jurorCount < 3 && (
              <Tooltip title="Juror Review">
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
                  Juror Review
                </Button>
              </Tooltip>
            )}

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
