import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppealSubmission from "./appeal/AppealSubmission";
import InitialSubmission from "./initial/InitialSubmission";
import MisuseSubmission from "./misuse/MisuseSubmission";
import RespondentSubmission from "./respondent/RespondentSubmission";

export default function SubmmissionManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState("initial");

  // Initialize selection from the URL on first render and keep in sync on back/forward
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl && typeFromUrl !== selected) {
      setSelected(typeFromUrl);
    }
  }, [searchParams]);

  // When selection changes, reflect it in the URL so it persists on refresh/share
  const handleChange = (value) => {
    setSelected(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("type", value);
      return next;
    });
  };

  return (
    <div>
      {/* Dropdown to pick which submission component to show */}
      <div className="">
        <div className="flex items-center justify-end gap-2">
          <label
            htmlFor="submission-select"
            className="!text-[20px] font-bold "
          >
            Select Type:
          </label>

          <Select
            id="submission-select"
            value={selected}
            onChange={handleChange}
            style={{ width: 300, height: 40 }}
            options={[
              { label: "Initial Submission", value: "initial" },
              { label: "Misuse Submission", value: "misuse" },
              { label: "Appeal Submission", value: "appeal" },
              { label: "Respondent Submission", value: "respondent" },
            ]}
          />
        </div>
      </div>

      {/* Render only the selected component */}
      {selected === "initial" && <InitialSubmission />}
      {selected === "misuse" && <MisuseSubmission />}
      {selected === "appeal" && <AppealSubmission />}
      {selected === "respondent" && <RespondentSubmission />}
    </div>
  );
}
