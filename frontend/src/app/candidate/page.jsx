"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCandidate } from "@/store/slices/candidatesSlice"; // Ensure this path is correct
import { Form, Input, Button, Upload, Radio, Card, message, Space } from "antd";
import { useRouter } from "next/navigation";
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Helper function to extract file list from upload event (standard for antd Form)
const normFile = (e) => {
  // console.log('Upload event:', e); // Keep for debugging if needed
  if (Array.isArray(e)) {
    return e;
  }
  // Return the file list or an empty list if no file is selected/removed
  return e?.fileList;
};

export default function CandidateForm() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State for loading indicator

  // *** MODIFIED handleSubmit function ***
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      let serializableCvData = null; // Initialize CV data as null

      // Check if a CV file exists in the form values provided by Ant Design's Form
      if (values.cv && values.cv.length > 0) {
        const fileObject = values.cv[0]; // Get the file item from the list
        const originalFile = fileObject.originFileObj; // The actual File object

        if (originalFile) {
            // --- Extract Serializable Metadata ---
             // This is the simplest fix for the Redux error without actual file uploading.
             // In a real app, you'd likely upload 'originalFile' here and store the resulting URL.
             serializableCvData = {
               uid: fileObject.uid,       // Unique ID from Ant Design Upload (serializable string)
               name: originalFile.name, // Serializable string
               size: originalFile.size, // Serializable number
               type: originalFile.type, // Serializable string
               // status: fileObject.status, // Ant Design upload status (e.g., 'done', 'uploading') - also serializable
               // lastModified: originalFile.lastModified, // Example: Store timestamp number instead of Date object
             };
             console.log("Prepared Serializable CV Metadata:", serializableCvData);

            // --- (Alternative) Placeholder for Real Upload Logic ---
            /*
            console.log("Uploading file:", originalFile.name);
            const formData = new FormData();
            formData.append('cvFile', originalFile, originalFile.name);
            // Replace with your actual API endpoint
            const uploadResponse = await fetch('/api/upload/cv', { method: 'POST', body: formData });
            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json();
              throw new Error(errorData.message || `Échec du téléchargement du fichier (${uploadResponse.status})`);
            }
            const uploadResult = await uploadResponse.json();
            // Assuming the API returns an object like { fileUrl: '...', fileName: '...' }
            serializableCvData = {
              url: uploadResult.fileUrl, // The URL is serializable
              name: uploadResult.fileName || originalFile.name,
              type: originalFile.type,
              size: originalFile.size
            };
            console.log("File Uploaded, storing URL:", serializableCvData);
            */
        } else {
            // Handle cases where originFileObj might be missing (though less likely with beforeUpload={() => false})
            console.warn("CV file object found in list, but originFileObj is missing:", fileObject);
            // Optionally treat this as an error or proceed without CV data
        }
      }

      // Prepare the final payload for Redux - ONLY serializable data
      const candidateData = {
        // Spread other form values (they are already serializable)
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        // Conditionally add the processed CV data (either metadata or URL)
        // If serializableCvData is null, the 'cv' key won't be added.
        ...(serializableCvData && { cv: serializableCvData })
      };

      console.log("Dispatching Serializable Candidate Data:", candidateData);

      // Dispatch the action with the cleaned, serializable data
      dispatch(addCandidate(candidateData));

      message.success("Candidat ajouté avec succès !");
      form.resetFields();
      // Optional: Redirect after successful submission
      // router.push('/candidates'); // Example redirect

    } catch (error) {
      console.error("Failed to process form or add candidate:", error);
      // Provide more specific feedback if possible (e.g., distinguish upload errors)
      message.error(`Erreur: ${error.message || "Impossible d'ajouter le candidat."}`);
    } finally {
      setLoading(false); // Stop loading regardless of success/error
    }
  };

  return (
    // Use Card for better grouping and title
    <div className="w-full flex justify-center">
    <Card className="w-full" title="Ajouter un Nouveau Candidat" style={{ margin: 20, maxWidth: 600 }}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        // Optional: Define initial values if needed
        // initialValues={{ gender: 'Non spécifié' }}
      >
        {/* --- Form Items (Unchanged) --- */}
        <Form.Item
          name="name"
          label="Nom et Prénom"
          rules={[{ required: true, message: 'Veuillez saisir le nom complet !' }]}
        >
          <Input placeholder="Ex: Marie Dubois" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Veuillez saisir l\'email !' },
            { type: 'email', message: 'Veuillez saisir un email valide !' },
          ]}
        >
          <Input type="email" placeholder="Ex: marie.dubois@example.com" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Téléphone"
          rules={[{ required: true, message: 'Veuillez saisir le numéro de téléphone !' }]}
        >
          <Input type="tel" placeholder="Ex: 0612345678" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Adresse"
          rules={[{ required: true, message: 'Veuillez saisir l\'adresse !' }]}
        >
          <TextArea rows={3} placeholder="Ex: 15 Avenue des Champs-Élysées, 75008 Paris" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Genre"
          rules={[{ required: true, message: 'Veuillez sélectionner le genre !' }]}
        >
          <Radio.Group>
            <Radio value="Homme">Homme</Radio>
            <Radio value="Femme">Femme</Radio>
             {/* Remove 'Autre' if not needed or handle appropriately */}
             {/* <Radio value="Autre">Autre</Radio> */}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="cv"
          label="CV (Format PDF, DOCX)"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Veuillez télécharger un CV !' }]}
        >
          <Upload
            beforeUpload={() => false} // IMPORTANT: Keep this to prevent auto-upload and allow processing in handleSubmit
            maxCount={1}
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            // Optional: Handle file removal correctly if needed, normFile usually handles this
            // onRemove={() => {
            //    // Optionally clear related state if needed, though form state handles it
            //    return true; // Allow removal
            // }}
          >
            <Button icon={<UploadOutlined />}>Cliquez pour Télécharger</Button>
          </Upload>
        </Form.Item>

        {/* --- Form Actions (Unchanged) --- */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? 'Soumission...' : 'Soumettre'}
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} disabled={loading}>
              Réinitialiser
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
    </div>
  );
}