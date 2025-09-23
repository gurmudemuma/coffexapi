
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATUS_COLORS } from '../../config/colors';

interface ApprovalStatusChartProps {
  data: any[];
}

export const ApprovalStatusChart: React.FC<ApprovalStatusChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pending" stroke={STATUS_COLORS.pending} name="Pending" />
        <Line type="monotone" dataKey="approved" stroke={STATUS_COLORS.approved} name="Approved" />
        <Line type="monotone" dataKey="rejected" stroke={STATUS_COLORS.rejected} name="Rejected" />
      </LineChart>
    </ResponsiveContainer>
  );
};
