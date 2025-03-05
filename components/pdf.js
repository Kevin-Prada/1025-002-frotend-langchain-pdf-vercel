import Image from 'next/image';

export default function PDF({ pdf, onPDFClick, onDelete, isSelected }) {
  const handleClick = () => {
    onPDFClick(pdf);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(pdf.id);
  };

  return (
    <div 
      className={`pdf-item ${isSelected ? 'selected' : ''}`} 
      onClick={handleClick}
    >
      <div className="pdf-icon">
        <Image src="/pdf-icon.png" width={50} height={50} alt="PDF icon" />
      </div>
      <div className="pdf-info">
        <h3>{pdf.name}</h3>
        <p>Estado: {pdf.selected ? 'Seleccionado' : 'No seleccionado'}</p>
      </div>
      <div className="pdf-actions">
        <button className="delete-button" onClick={handleDelete}>
          <Image src="/delete-icon.png" width={20} height={20} alt="Delete icon" />
        </button>
      </div>
    </div>
  );
}
