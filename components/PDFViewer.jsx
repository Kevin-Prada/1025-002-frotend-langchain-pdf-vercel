import React, { useState } from 'react';

const [question, setQuestion] = useState('');
const [answer, setAnswer] = useState('');
const [isLoading, setIsLoading] = useState(false);

const handleAskQuestion = async () => {
  if (!question.trim()) return;
  
  setIsLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/qa-pdf/${selectedPDF.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar la pregunta');
    }
    
    const data = await response.json();
    setAnswer(data.answer);
  } catch (error) {
    console.error('Error:', error);
    setAnswer('Lo siento, hubo un error al procesar tu pregunta.');
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="pdf-viewer-container">
    {selectedPDF && (
      <div className="qa-section">
        <h3>Preguntas sobre el PDF</h3>
        <div className="question-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Haz una pregunta sobre este PDF..."
            className="question-input"
          />
          <button 
            onClick={handleAskQuestion} 
            disabled={isLoading}
            className="ask-button"
          >
            {isLoading ? 'Procesando...' : 'Preguntar'}
          </button>
        </div>
        
        {answer && (
          <div className="answer-container">
            <h4>Respuesta:</h4>
            <p>{answer}</p>
          </div>
        )}
      </div>
    )}
  </div>
); 