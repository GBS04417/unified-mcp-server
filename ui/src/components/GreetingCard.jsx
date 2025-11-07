import React from 'react';
export default function GreetingCard({ greeting, updated }){
  return (
    <div className="widget" style={{maxWidth:420}}>
      <div style={{fontSize:'0.85rem',fontWeight:600}}>{greeting||'Hello!'}</div>
      <div className="small">Updated: {updated? new Date(updated).toLocaleTimeString(): '--'}</div>
    </div>
  );
}
