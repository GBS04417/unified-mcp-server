import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import GreetingCard from './components/GreetingCard.jsx';
import WorkloadBar from './components/WorkloadBar.jsx';
import PriorityList from './components/PriorityList.jsx';
import ChatPane from './components/ChatPane.jsx';
import { fetchDashboard } from './api.js';

export default function App(){
  const [active,setActive]=useState('focus');
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const focusUser = 'John'; // placeholder user; integrate auth later

  async function load(){
    setLoading(true);
    try{const d=await fetchDashboard(focusUser); setData(d);}catch(e){console.error(e);}finally{setLoading(false);} }
  useEffect(()=>{load();},[]);
  useEffect(()=>{function r(){load();} window.addEventListener('dashboard:refresh',r); return ()=>window.removeEventListener('dashboard:refresh',r);},[]);

  const priorities = (data?.urgencyBadges||[]).map(b=>({ id:b.id,title:b.title,urgency:b.urgency,score:b.score,source:b.source }));

  return (
    <div style={{display:'grid',gridTemplateRows:'48px 1fr',height:'100vh'}}>
      <div className="header-bar">
        <div className="header-title">Priority Dashboard</div>
        <div className="header-actions">
          <button onClick={load}>🔄 Refresh</button>
          <button>👤 Profile</button>
          <button>⚙️ Settings</button>
          <button className="primary">Publish</button>
        </div>
      </div>
      <div className="layout" style={{gridTemplateRows:'1fr'}}>
        <Sidebar active={active} onSelect={setActive} role={'USER'} />
        <div className="center-pane">
          {loading && <div className="widget">Loading...</div>}
          {!loading && (
            <>
              <GreetingCard greeting={data?.greeting} updated={data?.summary?.lastUpdated} />
              <WorkloadBar capacity={data?.capacityIndicator?.level} percentage={data?.capacityIndicator?.percentage} />
              <PriorityList items={priorities} />
            </>
          )}
        </div>
        <ChatPane />
      </div>
    </div>
  );
}
