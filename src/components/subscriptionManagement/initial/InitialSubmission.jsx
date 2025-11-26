import { Input, message, Modal, Select, Table } from "antd";
import { useMemo, useState } from "react";
// sampleData removed - using server data via RTK Query
import {
  useAdminDecisionInitialSubmissionMutation,
  useGetInitialSubmissionsQuery,
  useUpdateInitialSubmissionMutation,
} from "../../../redux/apiSlices/initialSubmission";
import { TableColumns } from "./CulomsTable";
import InitialCustomPdfModal from "./CustomPdfModal";
import { EditModal } from "./GeneratePDFContent ";

const { Option } = Select;

const InitialSubmission = () => {
  // local UI state
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [submissionType, setSubmissionType] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isJuryModalVisible, setIsJuryModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [lastNameSearch, setLastNameSearch] = useState("");

  const queryParams = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];
  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }

  if (submissionType && submissionType !== "All") {
    // Map display status to API status format
    const statusMap = {
      Pending: "PENDING",
      "Juror Review": "REVIEW",
      "Final Review": "REVIEW",
      Rejected: "REJECTED",
      Completed: "APPROVED",
    };
    const apiStatus =
      statusMap[submissionType] ||
      submissionType.toUpperCase().replace(/ /g, "_");
    queryParams.push({ name: "status", value: apiStatus });
  }

  // Fetch from server using RTK Query
  const {
    data: resp,
    isLoading,
    isFetching,
    error,
  } = useGetInitialSubmissionsQuery(queryParams);

  console.log(resp);

  // Map server response to table-friendly shape
  const tableData = useMemo(() => {
    const items = resp?.data || [];
    return items.map((item, index) => {
      const initiatorName =
        [item.user?.firstName, item?.user?.middleName, item.user?.lastName]
          .filter(Boolean)
          .join(" ") || "N/A";
      const email = item.user?.email || "N/A";
      const respondentName =
        [
          item?.submission?.respondentFastName,
          item?.submission?.respondentMiddleName,
          item?.submission?.respondentLastName,
        ]
          .filter(Boolean)
          .join(" ") || "N/A";
      const caseType = item.typeOfFiling || item.caseId || "N/A";
      const caseId = item?.submission?.caseId || "N/A";
      const jurorVote =
        (item?.submission?.jurorDecisions?.length || 0) + " of 3";
      const priority = item.priority || "N/A";
      const machineStatus = (item?.submission?.status || "").toString();
      const jurorCount = item?.submission?.jurorDecisions?.length || 0;
      const humanize = (s) =>
        (s || "")
          .toLowerCase()
          .replace(/_/g, " ")
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      let displayStatus;
      if (machineStatus === "APPROVED") {
        displayStatus = jurorCount < 3 ? "Juror Review" : "Final Review";
      } else if (machineStatus === "FINAL_REVIEW") {
        displayStatus = "Final Review";
      } else if (machineStatus === "COMPLETED") {
        displayStatus = "Completed";
      } else {
        displayStatus = humanize(machineStatus);
      }

      return {
        key: item._id,
        id: (page - 1) * limit + index + 1,
        initiatorName,
        email,
        respondentName,
        caseType,
        caseId,
        moderatorName: item.moderatorName || "N/A",
        jurorVote,
        priority,
        status: displayStatus,
        machineStatus,
        jurorCount,
        hasAdminDecision:
          item?.submission?.adminDecisions &&
          item?.submission?.adminDecisions.length > 0,
        raw: item,
      };
    });
  }, [resp, page, limit]);

  // Modal handlers
  const showPDFModal = (record) => {
    setSelectedRecord(record?.raw || record);
    setIsPDFModalVisible(true);
  };

  const showAcceptModal = (record) => {
    setSelectedRecord(record?.raw || record);
    setIsAcceptModalVisible(true);
  };

  const showJuryModal = (record) => {
    setSelectedRecord(record?.raw || record);
    setIsJuryModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record?.raw || record);
    setIsEditModalVisible(true);
  };

  // Action handlers
  const [updateSubmission, { isLoading: isUpdating }] =
    useUpdateInitialSubmissionMutation();

  const [adminDecisionSubmission, { isLoading: isSubmittingDecision }] =
    useAdminDecisionInitialSubmissionMutation();

  const handleAcceptSubmit = async () => {
    if (!selectedRecord?._id) return;
    try {
      await updateSubmission({
        id: selectedRecord._id,
        body: { status: "REVIEW" },
      }).unwrap();
      setIsAcceptModalVisible(false);
      message.success("Case sent to jury for review!");
    } catch (err) {
      console.error(err);
      message.error("Failed to send to jury");
    }
  };

  // Accept Function with Confirmation
  const directAccept = (record, newStatus = "REVIEW") => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to accept this submission and send it to jury?",
      okText: "Yes, Accept",
      cancelText: "Cancel",
      async onOk() {
        try {
          const id = record?.raw?.submission?._id || record?.key || record?.id;
          await updateSubmission({ id, body: { status: newStatus } }).unwrap();
          message.success("Case sent to jury successfully!");
        } catch (err) {
          console.error(err);
          message.error("Failed to send to jury");
        }
      },
    });
  };

  const handleJurySubmit = (juryDecision, juryReason) => {
    if (!juryDecision || !juryReason.trim()) {
      message.error("Please provide both decision and reason!");
      return false;
    }

    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        const newFeedback = [
          ...(item.juryFeedback || []),
          {
            jurorId: (item.juryFeedback?.length || 0) + 1,
            decision: juryDecision,
            reason: juryReason,
          },
        ];

        const newVoteCount = newFeedback.length;
        const newStatus =
          newVoteCount === 3 ? "Final Review" : "Under Jury Review";

        return {
          ...item,
          juryFeedback: newFeedback,
          jurorVote: `${newVoteCount} of 3`,
          status: newStatus,
        };
      }
      return item;
    });

    setData(updatedData);
    message.success("Jury decision submitted successfully!");
    return true;
  };

  const handleFinalEdit = async (decisions, formValues) => {
    if (!selectedRecord?._id) {
      message.error("No record selected");
      return false;
    }

    if (!decisions || decisions.length === 0) {
      message.error("Please provide at least one administrative decision");
      return false;
    }

    try {
      const result = await adminDecisionSubmission({
        id: selectedRecord._id,
        body: {
          adminDecisions: decisions,
        },
      }).unwrap();

      // Update status to APPROVED after final decision
      await updateSubmission({
        id: selectedRecord._id,
        body: { status: "APPROVED" },
      }).unwrap();

      console.log("Admin decision submitted:", result);
      setIsEditModalVisible(false);
      message.success("Final decision submitted successfully!");
      return true;
    } catch (err) {
      console.error("Error submitting admin decision:", err);
      message.error(err?.data?.message || "Failed to submit final decision");
      return false;
    }
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to reject this submission?",
      okText: "Yes, Reject",
      cancelText: "Cancel",
      async onOk() {
        try {
          const id = record?.raw?._id || record?.key || record?.id;
          await updateSubmission({ id, body: { status: "REJECTED" } }).unwrap();
          message.success("Submission rejected!");
        } catch (err) {
          console.error(err);
          message.error("Failed to reject submission");
        }
      },
    });
  };

  const actionHandlers = {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject,
    directAccept,
  };

  const components = {
    header: {
      row: (props) => (
        <tr
          {...props}
          style={{
            backgroundColor: "#f0f5f9",
            height: "50px",
            color: "secondary",
            fontSize: "18px",
            textAlign: "center",
            padding: "12px",
          }}
        />
      ),
      cell: (props) => (
        <th
          {...props}
          style={{
            color: "secondary",
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "center",
            padding: "12px",
          }}
        />
      ),
    },
  };

  const columns = TableColumns(actionHandlers);

  return (
    <div className="">
      {/* Filters */}
      <div className="flex justify-between items-end bg-red-300 p-3 rounded-lg mb-4 mt-4">
        <p className="text-[25px] font-semibold ml-1">Initial Submissions</p>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, email, case type, or submission type"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            style={{ width: 350, height: 40 }}
          />

          <Select
            value={submissionType}
            onChange={(val) => {
              setSubmissionType(val);
              setPage(1);
            }}
            style={{ width: 200, height: 40 }}
          >
            <Option value="All">All Status</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Juror Review">Juror Review</Option>
            <Option value="Final Review">Final Review</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mt-3">
        <div className="overflow-x-auto min-w-full p-0">
          <Table
            components={components}
            columns={columns}
            dataSource={tableData}
            rowKey="key"
            loading={isLoading || isFetching}
            pagination={{
              current: resp?.pagination?.page || page,
              pageSize: resp?.pagination?.limit || limit,
              total: resp?.pagination?.total || 0,
              onChange: (p, ps) => {
                setPage(p);
                setLimit(ps);
              },
            }}
            scroll={{ x: 1300 }}
            className="custom-table"
          />
        </div>
      </div>

      {/* Modals */}
      {/* <PDFModal
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        selectedRecord={selectedRecord}
      /> */}

      <InitialCustomPdfModal
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        selectedRecord={selectedRecord}
      />

      {/* <AcceptModal
        visible={isAcceptModalVisible}
        onCancel={() => setIsAcceptModalVisible(false)}
        onOk={handleAcceptSubmit}
        selectedRecord={selectedRecord}
      />

      <JuryModal
        visible={isJuryModalVisible}
        onCancel={() => setIsJuryModalVisible(false)}
        onSubmit={handleJurySubmit}
        selectedRecord={selectedRecord}
      /> */}

      <EditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleFinalEdit}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default InitialSubmission;
