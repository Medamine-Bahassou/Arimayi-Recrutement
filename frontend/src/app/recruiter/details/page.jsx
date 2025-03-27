"use client";

import { useSelector } from "react-redux";
import { Card, Descriptions, Typography, Empty, Space } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined // Or ManOutlined / WomanOutlined if you want specific gender icons
} from '@ant-design/icons';

const { Title } = Typography;

// Helper component/function to create labels with icons
const DetailLabel = ({ icon, text }) => (
  <Space>
    {icon}
    {text}
  </Space>
);

export default function CandidateDetails() {
  const candidate = useSelector((state) => state.candidates.selectedCandidate);

  if (!candidate) {
    // Use Ant Design's Empty component for a better placeholder
    return (
      <div style={{ padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Empty description="Aucun candidat sélectionné." />
      </div>
    );
  }

  return (
    // Use Card for overall structure and visual separation
    // Add some margin for spacing if needed, e.g., style={{ margin: 20 }}
    <Card style={{ margin: 20 }}>
      {/* Use Descriptions component for key-value display */}
      <Descriptions
        title={<Title level={4}>{candidate.name}</Title>} // Use Typography Title for the name
        bordered // Adds borders for clarity
        column={1} // Display items in a single column
        labelStyle={{ width: '120px' }} // Optional: set a fixed width for labels for alignment
      >
        <Descriptions.Item
          label={<DetailLabel icon={<MailOutlined />} text="Email" />}
        >
          {candidate.email || 'N/A'} {/* Handle potentially missing values */}
        </Descriptions.Item>

        <Descriptions.Item
          label={<DetailLabel icon={<PhoneOutlined />} text="Phone" />}
        >
          {candidate.phone || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item
          label={<DetailLabel icon={<HomeOutlined />} text="Address" />}
        >
          {candidate.address || 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item
          label={<DetailLabel icon={<UserOutlined />} text="Gender" />}
        >
          {candidate.gender || 'N/A'}
        </Descriptions.Item>

         {/* Add more Descriptions.Item for any other details */}
         {/* Example:
         <Descriptions.Item label="Status">
           {candidate.status}
         </Descriptions.Item>
         */}

      </Descriptions>
    </Card>
  );
}