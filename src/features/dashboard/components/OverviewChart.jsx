import {Pie, PieChart, Legend, Tooltip,Cell} from 'recharts';
function OverviewChart(Props)
{
    return(
        <PieChart width={400} height={400}>
            <Pie data={Props.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={120} fill="#8884d8" label>
               {Props.data.map((d,index)=>(
                <Cell key={index}fill={d.color}></Cell>
               ))}
            </Pie>
            <Tooltip/>
            <Legend/>
        </PieChart>
    )
}
export default OverviewChart;