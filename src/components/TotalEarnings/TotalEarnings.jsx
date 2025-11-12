import { DatePicker, Select, Table, Tag } from "antd";
import moment from "moment";
import { useMemo, useState } from "react";
import { useReportEarningsQuery } from "../../redux/apiSlices/earningSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const TotalEarnings = () => {
  // default to current year range
  const [dateRange, setDateRange] = useState([
    moment().startOf("year"),
    moment().endOf("year"),
  ]);

  // query the report earnings endpoint
  const startDate =
    dateRange && dateRange[0]
      ? moment(dateRange[0]).format("YYYY-MM-DD")
      : null;
  const endDate =
    dateRange && dateRange[1]
      ? moment(dateRange[1]).format("YYYY-MM-DD")
      : null;

  const {
    data: earningsResp,
    isLoading: earningsLoading,
    isError: earningsError,
  } = useReportEarningsQuery(
    { startDate, endDate },
    { skip: !startDate || !endDate }
  );

  // map API paymentDetails to table rows
  const tableData = useMemo(() => {
    const details = earningsResp?.data?.paymentDetails || [];
    return details.map((p, idx) => {
      const submission = p.submissionId || {};
      const user = p.user || {};
      const respondentName = [
        submission.respondentFastName,
        submission.respondentMiddleName,
        submission.respondentLastName,
      ]
        .filter(Boolean)
        .join(" ");
      const jurorVote = Array.isArray(submission.jurorDecisions)
        ? `${submission.jurorDecisions.length} of ${submission.jurorDecisions.length}`
        : "0 of 0";

      return {
        id: p._id || idx + 1,
        initiatorName: user.name || "-",
        email: user.email || "-",
        respondentName: respondentName || "-",
        caseType: submission.submittionType || "-",
        moderatorName: "-",
        jurorVote,
        revenue: `$${(p.price || 0).toFixed(2)}`,
        status: p.paymentStatus || submission.status || "-",
      };
    });
  }, [earningsResp]);

  // Calculate total revenue from API rows
  const totalRevenue = useMemo(() => {
    return tableData.reduce((sum, item) => {
      const amount =
        parseFloat(String(item.revenue).replace(/[^0-9.-]+/g, "")) || 0;
      return sum + amount;
    }, 0);
  }, [tableData]);

  // (totalRevenue computed from API rows via useMemo above)

  const columns = [
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
      title: "Juror Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (revenue) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>{revenue}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Running" ? "green" : "blue"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Total Earnings
        </h1>
        <p className="text-gray-600">
          Track and monitor your revenue and earnings
        </p>
      </div>

      {/* Statistics Cards */}
      {/* <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Cases"
              value={data.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Cases"
              value={data.filter(item => item.status === "Running").length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Revenue"
              value={totalRevenue / data.length}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row> */}

      {/* Date Range Filter */}
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* <span className="text-sm font-medium">Date Range:</span> */}
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 150 }}
          >
            <Option value="February 2025">February 2025</Option>
            <Option value="January 2025">January 2025</Option>
            <Option value="December 2024">December 2024</Option>
            <Option value="November 2024">November 2024</Option>
          </Select>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-600 font-medium">
            Total Revenue:{" "}
          </span>
          <span className="text-lg font-bold text-blue-700">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Earnings Table */}
      <div style={{ overflowX: "auto" }}>
        <Table
          components={components}
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            // showSizeChanger: true,
            // showQuickJumper: true,
            // showTotal: (total, range) =>
            //   `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
          // rowSelection={{
          //   type: 'checkbox',
          //   onChange: (selectedRowKeys, selectedRows) => {
          //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          //   },
          // }}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default TotalEarnings;
