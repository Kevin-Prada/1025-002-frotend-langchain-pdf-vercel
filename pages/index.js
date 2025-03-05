import Head from 'next/head'
import Layout from '../components/layout';
import PDFList from '../components/pdf-list';
import styles from '../styles/layout.module.css'
import { useEffect, useState } from 'react';

export default function Home() {
  const [PDFs, setPDFs] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs`);
        if (!response.ok) {
          throw new Error('Error al obtener los PDFs');
        }
        const data = await response.json();
        setPDFs(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPDFs();
  }, []);

  return (
    <div>
      <Head>
        <title>Basic PDF CRUD App</title>
        <meta name="description" content="Basic PDF CRUD App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PDFList />
      </Layout>
    </div>
  )
}