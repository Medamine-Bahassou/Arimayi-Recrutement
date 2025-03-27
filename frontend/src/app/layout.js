"use client";

import { NextIntlProvider } from "next-intl";
import "antd/dist/reset.css"; // Ant Design Styles
import './globals.css'
import '@ant-design/v5-patch-for-react-19';

import { List, Button } from "antd";

import { store } from "../store";
import { Provider } from 'react-redux'
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {

    const router = useRouter()
  
  return (
    <html lang="fr">
      <body>
        <div className="w-full h-16 bg-base-300 flex justify-between p-4 bg-gray-100 shadow ">
          <h2 className="text-xl font-bold " >ARIMAYI Recrutement</h2>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/recruiter')}>recruiter</Button>
            <Button onClick={() => router.push('/candidate')}>candidate</Button>
          </div>
        </div>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
