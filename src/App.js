import React, { useState } from 'react';
import './App.css'; // Certifique-se de estilizar adequadamente o seu app

function App() {
  // Estado para armazenar a pergunta do usuário e as respostas
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para enviar a mensagem
  const handleUserMessage = async (message) => {
    if (!message) return;

    setLoading(true); // Iniciar o carregamento

    try {
      // Adiciona a pergunta ao histórico
      setConversation([...conversation, { sender: 'user', text: message }]);

      // Enviar para o webhook do Dialogflow
      const res = await fetch('https://chatbot-wolframalpha.onrender.com/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryResult: { queryText: message }
        }),
      });
      const dialogflowResponse = await res.json();
      const dialogflowMessage = dialogflowResponse.fulfillmentText;

      // Adiciona a resposta do Dialogflow ao histórico
      setConversation(prevState => [...prevState, { sender: 'bot', text: dialogflowMessage }]);

    } catch (error) {
      console.error('Erro:', error);
      setConversation(prevState => [...prevState, { sender: 'bot', text: 'Desculpe, ocorreu um erro.' }]);
    }

    setLoading(false); // Finalizar o carregamento
    setMessage(''); // Limpar a entrada do usuário
  };

  // Função chamada quando o usuário pressiona "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUserMessage(message);
    }
  };

  return (
    <div className="App">
      <h1>Chatbot com Dialogflow</h1>

      <div className="chat-box">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua pergunta..."
        />
        <button onClick={() => handleUserMessage(message)} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}

export default App;
