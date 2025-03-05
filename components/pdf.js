import Image from 'next/image';
import styles from '../styles/pdf.module.css';

export default function PDFComponent({ pdf, onDelete, onChange, onPDFClick }) {
  const handleClick = () => {
    if (onPDFClick) {
      onPDFClick(pdf);
    }
  };

  return (
    <div className={styles.pdfItem} onClick={handleClick}>
      <div className={styles.pdfInfo}>
        <h3>{pdf.name}</h3>
        <div className={styles.pdfControls}>
          <label>
            <input
              type="checkbox"
              name="selected"
              checked={pdf.selected}
              onChange={(e) => onChange(e, pdf.id)}
            />
            Seleccionado
          </label>
          <button 
            className={styles.deleteBtn} 
            onClick={(e) => {
              e.stopPropagation(); // Evita que el clic se propague al contenedor
              onDelete(pdf.id);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
