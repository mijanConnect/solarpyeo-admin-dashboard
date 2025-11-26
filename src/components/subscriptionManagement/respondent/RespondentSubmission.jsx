import { Input, message, Modal, Select, Table } from "antd";
import { useMemo, useState } from "react";
// sampleData removed - using server data via RTK Query
import {
  useGetRespondentSubmissionsQuery,
  useUpdateRespondentSubmissionMutation,
} from "../../../redux/apiSlices/respondentSubmission";
import { TableColumns } from "./CulomsTable";
// import { AcceptModal, EditModal, JuryModal } from "./GeneratePDFContent ";
import RespopndentCustomPdfModal from "../respondent/CustomPdfModal";

const { Option } = Select;

const RespondentSubmission = () => {
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
      Approved: "APPROVED",
      Rejected: "REJECTED",
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
    refetch,
  } = useGetRespondentSubmissionsQuery(queryParams);

  console.log(resp);

  // Map server response to table-friendly shape
  const tableData = useMemo(() => {
    const items = resp?.data || [];
    return items.map((item, index) => {
      const initiatorName =
        item.user?.firstName +
          " " +
          item.user?.middleName +
          " " +
          item.user?.lastName || "N/A";
      const email = item.user?.email || "N/A";
      const signature = item?.signature || "N/A";
      const machineStatus = (item.status || "").toString();
      const humanize = (s) =>
        (s || "")
          .toLowerCase()
          .replace(/_/g, " ")
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

      const displayStatus = humanize(machineStatus);

      return {
        key: item._id,
        id: (page - 1) * limit + index + 1,
        initiatorName,
        email,
        signature,
        status: displayStatus,
        machineStatus,
        raw: item,
      };
    });
  }, [resp, page, limit]);

  // Modal handlers
  const showPDFModal = (record) => {
    setSelectedRecord(record?.raw || record);
    setIsPDFModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record?.raw || record);
    setIsEditModalVisible(true);
  };

  // const showAcceptModal = (record) => {
  //   setSelectedRecord(record?.raw || record);
  //   setIsAcceptModalVisible(true);
  // };

  // const showJuryModal = (record) => {
  //   setSelectedRecord(record?.raw || record);
  //   setIsJuryModalVisible(true);
  // };

  // const showEditModal = (record) => {
  //   setSelectedRecord(record?.raw || record);
  //   setIsEditModalVisible(true);
  // };

  // Action handlers
  const [updateSubmission, { isLoading: isUpdating }] =
    useUpdateRespondentSubmissionMutation();

  // Final review form state
  const [finalDecisionText, setFinalDecisionText] = useState("");
  const [finalAdminComments, setFinalAdminComments] = useState("");
  const [finalResult, setFinalResult] = useState("");

  const handleFinalReviewSubmit = async () => {
    if (!selectedRecord?._id) return;
    if (!finalDecisionText.trim()) {
      message.error("Please provide final decision text");
      return;
    }

    try {
      await updateSubmission({
        id: selectedRecord._id,
        body: {
          status: "COMPLETED",
          finalDecisions: [finalDecisionText.trim()],
          adminComments: finalAdminComments,
          finalResult: finalResult,
        },
      }).unwrap();

      setIsEditModalVisible(false);
      // reset form
      setFinalDecisionText("");
      setFinalAdminComments("");
      setFinalResult("");
      message.success("Final review submitted");
      // refresh list to reflect new status
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Failed to submit final review");
    }
  };

  const handleAcceptSubmit = async () => {
    if (!selectedRecord?._id) return;
    try {
      await updateSubmission({
        id: selectedRecord._id,
        body: { status: "APPROVED" },
      }).unwrap();
      setIsAcceptModalVisible(false);
      message.success("Case sent to jury for review!");
    } catch (err) {
      console.error(err);
      message.error("Failed to send to jury");
    }
  };

  // Accept Function with Confirmation
  const directAccept = (record, newStatus = "APPROVED") => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to accept this submission and send it to jury?",
      okText: "Yes, Accept",
      cancelText: "Cancel",
      async onOk() {
        try {
          const id = record?.raw?._id || record?.key || record?.id;
          await updateSubmission({ id, body: { status: newStatus } }).unwrap();
          message.success("Case updated successfully!");
          // refresh list so UI shows only Details for finalized statuses
          try {
            refetch();
          } catch (e) {
            // ignore refetch errors
          }
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

  const handleFinalEdit = (decisions, formValues) => {
    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        return {
          ...item,
          status: "Finalized",
          finalDecisions: decisions,
          adminComments: formValues.adminComments,
          finalResult: formValues.finalResult,
        };
      }
      return item;
    });

    setData(updatedData);
    message.success("Final decision submitted successfully!");
    return true;
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
    showEditModal,
    // showAcceptModal,
    // showJuryModal,
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
        <p className="text-[25px] font-semibold ml-1">Respondent Submissions</p>
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
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
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

      <RespopndentCustomPdfModal
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        selectedRecord={selectedRecord}
      />

      <Modal
        title="Final Review"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleFinalReviewSubmit}
        okText="Submit Final Review"
        cancelText="Cancel"
        width={700}
      >
        <div className="space-y-3">
          <div>
            <label className="font-medium">Final Decision</label>
            <Input.TextArea
              value={finalDecisionText}
              onChange={(e) => setFinalDecisionText(e.target.value)}
              placeholder="Enter final decision summary"
              rows={3}
            />
          </div>

          <div>
            <label className="font-medium">Admin Comments (optional)</label>
            <Input.TextArea
              value={finalAdminComments}
              onChange={(e) => setFinalAdminComments(e.target.value)}
              placeholder="Any notes"
              rows={2}
            />
          </div>

          <div>
            <label className="font-medium">Final Result</label>
            <Select
              value={finalResult}
              onChange={(v) => setFinalResult(v)}
              style={{ width: "100%" }}
            >
              <Option value="APPROVED">Approved</Option>
              <Option value="REJECTED">Rejected</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>
          </div>
        </div>
      </Modal>

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
      />

      <EditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleFinalEdit}
        selectedRecord={selectedRecord}
      /> */}
    </div>
  );
};

export default RespondentSubmission;
