import styles from '../styles/pdf-list.module.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import PDFComponent from './pdf';
import PDFViewer from './PDFViewer';

export default function PdfList() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState('all');
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchPdfs();
    }
  }, []);

  async function fetchPdfs(filterValue = 'all') {
    try {
      const url = filterValue === 'all' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/pdfs` 
        : `${process.env.NEXT_PUBLIC_API_URL}/pdfs?selected=${filterValue === 'selected'}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los PDFs');
      }
      const data = await response.json();
      setPdfs(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const debouncedUpdatePdf = useCallback(debounce((pdf, fieldChanged) => {
    updatePdf(pdf, fieldChanged);
  }, 500), []);

  function handlePdfChange(e, id) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const copy = [...pdfs];
    const idx = pdfs.findIndex((pdf) => pdf.id === id);
    const changedPdf = { ...pdfs[idx], [name]: value };
    copy[idx] = changedPdf;
    debouncedUpdatePdf(changedPdf, name);
    setPdfs(copy);
  }

  async function updatePdf(pdf, fieldChanged) {
    const body_data = JSON.stringify(pdf);
    const url = process.env.NEXT_PUBLIC_API_URL + `/pdfs/${pdf.id}`;
 
    await fetch(url, {
        method: 'PUT',
        body: body_data,
        headers: { 'Content-Type': 'application/json' }
    });
  }

  async function handleDeletePdf(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      const copy = pdfs.filter((pdf) => pdf.id !== id);
      setPdfs(copy);
      if (selectedPDF && selectedPDF.id === id) {
        setSelectedPDF(null);
      }
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Por favor selecciona un archivo para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newPdf = await response.json();
      setPdfs([...pdfs, newPdf]);
      setSelectedFile(null);
    } else {
      alert("Error al subir el archivo.");
    }
  };

  function handleFilterChange(value) {
    setFilter(value);
    fetchPdfs(value);
  }

  const handlePDFClick = useCallback((pdf) => {
    setSelectedPDF(pdf);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainInputContainer}>
        <form onSubmit={handleUpload}>
          <input className={styles.mainInput} type="file" accept=".pdf" onChange={handleFileChange} />
          <button className={styles.loadBtn} type="submit">Subir PDF</button>
        </form>
      </div>
      {!pdfs.length && <div>Loading...</div>}
      {pdfs.map((pdf) => (
        <PDFComponent key={pdf.id} pdf={pdf} onDelete={handleDeletePdf} onChange={handlePdfChange} />
      ))}
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${filter === 'all' && styles.filterActive}`} onClick={() => handleFilterChange('all')}>Todos</button>
        <button className={`${styles.filterBtn} ${filter === 'selected' && styles.filterActive}`} onClick={() => handleFilterChange('selected')}>Seleccionados</button>
        <button className={`${styles.filterBtn} ${filter === 'unselected' && styles.filterActive}`} onClick={() => handleFilterChange('unselected')}>No seleccionados</button>
      </div>
      <div className={styles.pdfViewerWrapper}>
        {selectedPDF && <PDFViewer selectedPDF={selectedPDF} />}
      </div>
    </div>
  );
}
