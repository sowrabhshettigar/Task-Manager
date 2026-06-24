import {
  Pie,
  PieChart,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

function OverviewChart({ data }) {
  return (
    <div className="flex justify-center h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="40%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            strokeWidth={0}
          >
            {data.map((item, index) => (
              <Cell key={index} fill={item.color} />
            ))}
          </Pie>

          <Tooltip />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewChart;
