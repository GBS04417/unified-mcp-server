import React, { useState } from 'react';

export default function ChatPane(){
  const [messages,setMessages]=useState([
    { id:1, role:'system', text:'💬 AI Assistant ready. Ask about priority rationale or workload optimization.' }
  ]);
  const [input,setInput]=useState('');
  function send(){
    if(!input.trim()) return;
    const userMsg={id:Date.now(),role:'user',text:input.trim()};
    setMessages(m=>[...m,userMsg,{id:Date.now()+1,role:'system',text:'(Placeholder response) Priorities are computed using weighted scores.'}]);
    setInput('');
  }
  return (
    <div className="chat-pane">
      <div style={{fontWeight:600,fontSize:'0.85rem',marginBottom:8}}>AI Assistant</div>
      <div className="chat-messages">
        {messages.map(m=> <div key={m.id} className={'message '+(m.role==='system'?'system':'')}>{m.text}</div>)}
      </div>
      <div className="chat-input-row">
        <input placeholder="Type a message" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') send();}} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
