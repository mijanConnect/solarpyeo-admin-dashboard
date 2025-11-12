import { Alert, DatePicker, Select, Spin, Table } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalyticsQuery } from "../../redux/apiSlices/reportSlice";

// enable isBetween plugin for dayjs
dayjs.extend(isBetween);

const { Option } = Select;
const { RangePicker } = DatePicker;

// helper: format number with thousand separators and put $ on the right
function formatCurrencyRight(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return `${value} $`;
  return `${num.toLocaleString()} $`;
}

function tooltipFormatter(value, name) {
  if (name === "revenue") return formatCurrencyRight(value);
  return value;
}

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

// Sample data
const data = [
  {
    date: "Jan 2025",
    category: "Employee",
    region: "USA",
    revenue: 100,
    users: 65,
    submission: 32,
  },
  {
    date: "Feb 2025",
    category: "Employee",
    region: "USA",
    revenue: 75,
    users: 60,
    submission: 27,
  },
  {
    date: "Mar 2025",
    category: "Employee",
    region: "USA",
    revenue: 50,
    users: 62,
    submission: 22,
  },
  {
    date: "Apr 2025",
    category: "Employee",
    region: "UK",
    revenue: 69,
    users: 54,
    submission: 29,
  },
  {
    date: "May 2025",
    category: "Employee",
    region: "UK",
    revenue: 47,
    users: 59,
    submission: 24,
  },
  {
    date: "Jun 2025",
    category: "Employee",
    region: "UK",
    revenue: 60,
    users: 68,
    submission: 37,
  },
  {
    date: "Jul 2025",
    category: "Employee",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Aug 2025",
    category: "Employee",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Sep 2025",
    category: "Customer",
    region: "UK",
    revenue: 38,
    users: 57,
    submission: 100,
  },
  {
    date: "Oct 2025",
    category: "Customer",
    region: "UK",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Nov 2025",
    category: "Customer",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Dec 2025",
    category: "Customer",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Jan 2026",
    category: "Partner",
    region: "Canada",
    revenue: 95,
    users: 72,
    submission: 38,
  },
  {
    date: "Feb 2026",
    category: "Partner",
    region: "Canada",
    revenue: 82,
    users: 68,
    submission: 41,
  },
  {
    date: "Mar 2026",
    category: "Vendor",
    region: "Australia",
    revenue: 76,
    users: 63,
    submission: 35,
  },
];

// Dropdown options
const monthYearOptions = [...new Set(data.map((d) => d.date))];
const categoryOptions = [
  "All Categories",
  ...new Set(data.map((d) => d.category)),
];
const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
const metricOptions = ["revenue", "users", "submission"];

const maxValues = {
  revenue: Math.max(...data.map((d) => d.revenue)),
  users: Math.max(...data.map((d) => d.users)),
  submission: Math.max(...data.map((d) => d.submission)),
};

// Custom 3D Bar with watermark
const Custom3DBarWithWatermark = ({
  x,
  y,
  width,
  height,
  fill,
  dataKey,
  payload,
}) => {
  const depth = 10;
  const maxValue = maxValues[dataKey];
  const scale = maxValue / payload[dataKey];
  const watermarkHeight = height * scale;
  const watermarkY = y - (watermarkHeight - height);

  return (
    <g>
      <g opacity={0.1}>
        <rect
          x={x}
          y={watermarkY}
          width={width}
          height={watermarkHeight}
          fill={fill}
        />
        <polygon
          points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
            x + width + depth
          },${watermarkY - depth} ${x + width},${watermarkY}`}
          fill={fill}
        />
        <polygon
          points={`${x + width},${watermarkY} ${x + width + depth},${
            watermarkY - depth
          } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
            watermarkY + watermarkHeight
          }`}
          fill={fill}
        />
      </g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={0.4}
      />
      <polygon
        points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
          y - depth
        } ${x + width},${y}`}
        fill={fill}
        opacity={0.6}
      />
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${
          x + width + depth
        },${y + height} ${x + width},${y + height}`}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

export default function MonthlyStatsChart() {
  const [selectedMonthYear, setSelectedMonthYear] = useState("All Months");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("Bar");
  // default to current year (Jan - Dec) so we show this year's data on first load
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("year"),
    dayjs().endOf("year"),
  ]);

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Category",
      "Region",
      "Revenue",
      "Users",
      "Submission",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.date,
          row.category,
          row.region,
          row.revenue,
          row.users,
          row.submission,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare API params from dateRange
  const startDate =
    dateRange && dateRange[0] ? dayjs(dateRange[0]).format("YYYY-MM-DD") : null;
  const endDate =
    dateRange && dateRange[1] ? dayjs(dateRange[1]).format("YYYY-MM-DD") : null;

  const {
    data: analyticsResp,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useAnalyticsQuery(
    { startDate, endDate },
    { skip: !startDate || !endDate }
  );

  // Map analyticsResp to apiData shape used by the component
  const apiData =
    analyticsResp?.data && Array.isArray(analyticsResp.data)
      ? analyticsResp.data.map((m) => {
          // choose year between start and end that places the month inside range; fallback to startDate year
          const startYear = startDate
            ? dayjs(startDate).year()
            : dayjs().year();
          const endYear = endDate ? dayjs(endDate).year() : startYear;
          let chosenYear = startYear;
          for (let y = startYear; y <= endYear; y++) {
            const candidate = dayjs(`${m.month} ${y}`, "MMM YYYY");
            if (startDate && endDate) {
              if (
                candidate.isBetween(
                  dayjs(startDate),
                  dayjs(endDate),
                  "day",
                  "[]"
                )
              ) {
                chosenYear = y;
                break;
              }
            }
          }
          const dateStr = `${m.month} ${chosenYear}`;
          return {
            date: dateStr,
            category: "API",
            region: "API",
            revenue: m.totalRevenue,
            users: m.totalVerifiedUserCount,
            submission: m.totalSubmissionCount,
            _dateObj: dayjs(dateStr, "MMM YYYY"),
          };
        })
      : analyticsResp
      ? []
      : null;

  const filteredData = useMemo(() => {
    // Use API data only. apiData === null -> not fetched yet; [] -> fetched but empty.
    const sourceRaw = apiData || [];
    const source = sourceRaw.map((item) => ({
      ...item,
      _dateObj: item._dateObj || dayjs(item.date, "MMM YYYY"),
    }));

    return source.filter((d) => {
      // Category filter
      const categoryMatch =
        selectedCategory === "All Categories" ||
        d.category === selectedCategory;

      // Region filter
      const regionMatch =
        selectedRegion === "All Regions" || d.region === selectedRegion;

      // Month/Year filter
      const monthYearMatch =
        selectedMonthYear === "All Months" || d.date === selectedMonthYear;

      // Date range filter
      let dateRangeMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = d._dateObj || dayjs(d.date, "MMM YYYY");
        const startDate = dayjs(dateRange[0]);
        const endDate = dayjs(dateRange[1]);
        // compare by day range to include months partially covered
        dateRangeMatch = itemDate.isBetween(startDate, endDate, "day", "[]");
      }

      return categoryMatch && regionMatch && monthYearMatch && dateRangeMatch;
    });
  }, [selectedCategory, selectedRegion, selectedMonthYear, dateRange, apiData]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    // { title: "Category", dataIndex: "category", key: "category" },
    // { title: "Region", dataIndex: "region", key: "region" },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (val) => formatCurrencyRight(val),
    },
    { title: "Users", dataIndex: "users", key: "users" },
    { title: "Submission", dataIndex: "submission", key: "submission" },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <RangePicker
          className="min-w-[200px] sm:w-[250px]"
          placeholder={["Start Date", "End Date"]}
          onChange={setDateRange}
          format="MMM YYYY"
        />

        {/* Loading / empty / error states */}
        {analyticsLoading && (
          <div className="ml-4">
            <Spin />
          </div>
        )}

        {!analyticsLoading && analyticsError && (
          <div className="ml-4" style={{ minWidth: 260 }}>
            <Alert type="error" message="Failed to load analytics" showIcon />
          </div>
        )}

        {!analyticsLoading && apiData === null && (
          <div className="ml-4" style={{ minWidth: 300 }}>
            <Alert
              type="info"
              message="Select start & end month to load analytics"
              showIcon
            />
          </div>
        )}

        {!analyticsLoading &&
          apiData &&
          Array.isArray(apiData) &&
          apiData.length === 0 && (
            <div className="ml-4" style={{ minWidth: 260 }}>
              <Alert
                type="info"
                message="No analytics data for the selected range"
                showIcon
              />
            </div>
          )}

        {/* <Select
          value={selectedMonthYear}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedMonthYear}
        >
          <Option value="All Months">All Months</Option>
          {monthYearOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedCategory}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedCategory}
        >
          {categoryOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedRegion}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedRegion}
        >
          {regionOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedMetric}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedMetric}
        >
          <Option value="all">All Metrics</Option>
          {metricOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={chartType}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setChartType}
        >
          <Option value="Bar">Bar Chart</Option>
          <Option value="Line">Line Chart</Option>
          <Option value="Area">Area Chart</Option>
        </Select> */}

        {/* <Button className="bg-primary text-white" onClick={exportToCSV}>Export Report</Button> */}
      </div>

      {/* Chart */}
      <div
        className="p-4 rounded-lg border w-full mt-10 overflow-x-auto"
        style={{ height: 400 }}
      >
        <ResponsiveContainer>
          {chartType === "Bar" ? (
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
              barGap={13}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              {selectedMetric === "revenue" ? (
                <YAxis tickFormatter={(v) => formatCurrencyRight(v)} />
              ) : (
                <YAxis />
              )}
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "revenue") && (
                <Bar
                  dataKey="revenue"
                  fill="#7086FD"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="revenue" />
                  )}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "users") && (
                <Bar
                  dataKey="users"
                  fill="#6FD195"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="users" />
                  )}
                />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "submission") && (
                <Bar
                  dataKey="submission"
                  fill="#FFAE4C"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="submission" />
                  )}
                />
              )}
            </BarChart>
          ) : chartType === "Line" ? (
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              {selectedMetric === "revenue" ? (
                <YAxis tickFormatter={(v) => formatCurrencyRight(v)} />
              ) : (
                <YAxis />
              )}
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "revenue") && (
                <Line type="monotone" dataKey="revenue" stroke="#7086FD" />
              )}
              {(selectedMetric === "all" || selectedMetric === "users") && (
                <Line type="monotone" dataKey="users" stroke="#6FD195" />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "submission") && (
                <Line type="monotone" dataKey="submission" stroke="#FFAE4C" />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              {selectedMetric === "revenue" ? (
                <YAxis tickFormatter={(v) => formatCurrencyRight(v)} />
              ) : (
                <YAxis />
              )}
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "revenue") && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7086FD"
                  fill="#7086FD"
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "users") && (
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6FD195"
                  fill="#6FD195"
                />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "submission") && (
                <Area
                  type="monotone"
                  dataKey="submission"
                  stroke="#FFAE4C"
                  fill="#FFAE4C"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Ant Design Table */}
      <div className="mt-12">
        <h1 className="text-lg sm:text-xl lg:text-[22px] font-bold mb-4">
          Data Table
        </h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <Table
            bordered={false}
            size="small"
            rowClassName="custom-row"
            components={components}
            className="custom-table min-w-full"
            scroll={{ x: "max-content" }}
            columns={columns.filter(
              (col) =>
                col.dataIndex === "date" ||
                col.dataIndex === "category" ||
                col.dataIndex === "region" ||
                selectedMetric === "all" ||
                col.dataIndex === selectedMetric
            )}
            dataSource={filteredData.map((row, index) => ({
              ...row,
              key: index,
            }))}
            pagination={{
              pageSize: 6,
              showSizeChanger: false,
              showQuickJumper: false,
              responsive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
