import { useState } from "react";
import api from "../api.js";

export default function AdminReports() {
  const [report, setReport] = useState(null);

  const loadReport = async (type) => {
    const res = await api.get(`/admin/reports/${type}`);
    setReport(res.data);
  };

  return (
    <section>
      <h1>Báo cáo</h1>
      <div className="panel">
        <div className="row">
          <button onClick={() => loadReport("daily")}>Ngày</button>
          <button onClick={() => loadReport("weekly")}>Tuần</button>
          <button onClick={() => loadReport("monthly")}>Tháng</button>
          <button onClick={() => loadReport("yearly")}>Năm</button>
        </div>
        {report && <pre className="report">{JSON.stringify(report, null, 2)}</pre>}
      </div>
    </section>
  );
}
