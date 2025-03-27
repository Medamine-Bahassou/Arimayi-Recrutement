"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectCandidate } from "@/store/slices/candidatesSlice"; // Ensure path is correct
import { List, Button, Card, Typography, Empty, Avatar, Space } from "antd";
import { UserOutlined /* Import other icons like MailOutlined, PhoneOutlined if needed */ } from '@ant-design/icons';
import { useRouter } from "next/navigation";
// Removed useEffect as it was only for logging

const { Title } = Typography;

export default function RecruiterList() {
  // Get candidates list from Redux store
  const candidates = useSelector((state) => state.candidates.listCandidate);
  const dispatch = useDispatch();
  const router = useRouter();

  // Handler for viewing candidate details
  const handleViewDetails = (candidate) => {
    if (!candidate) return; // Safety check
    dispatch(selectCandidate(candidate)); // Set the selected candidate in Redux state
    router.push("/recruiter/details"); // Navigate to the details page (ensure this path is correct)
  };

  return (
    // Wrap content in a Card for better structure and title placement
    <Card title={<Title level={4}>Liste des Candidats</Title>} style={{ margin: 20 }}>

      {/* Handle the empty state: Show Empty component if no candidates */}
      {(!candidates || candidates.length === 0) ? (
        <Empty description="Aucun candidat trouvé." />
      ) : (
        // Render the List if candidates exist
        <List
          itemLayout="horizontal" // Gives a standard layout suitable for avatar/meta
          dataSource={candidates}
          renderItem={(item) => (
            <List.Item
              // Place actions (like buttons) in the 'actions' prop
              actions={[
                <Button
                  key={`details-${item?.email || item?.id}`} // Unique key is important for list actions
                  type="link"
                  onClick={() => handleViewDetails(item)}
                  aria-label={`Voir les détails de ${item?.name || 'candidat inconnu'}`} // Accessibility
                >
                  Voir Détails
                </Button>,
                // Example: Add more actions if needed later
                // <Button key="edit" type="link" icon={<EditOutlined />}>Modifier</Button>,
              ]}
            >
              {/* Use List.Item.Meta for structured content: avatar, title, description */}
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />} // Simple user avatar
                title={item?.name || 'Nom Inconnu'} // Candidate name as title, with fallback
                description={ // Use description for secondary info like email, phone etc.
                   <Space direction="vertical" size={0}>
                     {item?.email && <span>{item.email}</span>}
                     {/* You could add phone here too if available and relevant */}
                     {/* {item?.phone && <span>{item.phone}</span>} */}
                   </Space>
                }
              />
               {/* You can still add other content directly if Meta isn't sufficient */}
               {/* <div>Status: {item?.status || 'N/A'}</div> */}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}