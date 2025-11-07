import React from 'react';

function badgeClass(u){return 'badge '+u.toLowerCase();}
function cardClass(u){return 'priority-card '+u.toLowerCase();}

export default function PriorityList({ title='Top Priorities', items=[] }){
  return (
    <div className="widget">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:600,fontSize:'0.8rem'}}>{title}</span>
      </div>
      <div className="priority-grid">
        {items.map(it=> (
          <div key={it.id} className={cardClass(it.urgency)}>
            <span className={badgeClass(it.urgency)}>{it.urgency}</span>
            <div style={{fontSize:'0.7rem',fontWeight:600}}>{it.title}</div>
            <div className="small" style={{marginTop:4}}>Score: {it.score}</div>
            {it.source && <div className="small">{it.source}</div>}
          </div>
        ))}
        {items.length===0 && <div className="small" style={{opacity:.5}}>No priority items.</div>}
      </div>
      <div className="refresh-row">
        <button onClick={()=>window.dispatchEvent(new CustomEvent('dashboard:refresh'))}>Refresh</button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent('dashboard:settings'))}>Settings</button>
      </div>
    </div>
  );
}
