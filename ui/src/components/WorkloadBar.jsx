import React from 'react';

export default function WorkloadBar({ capacity, percentage }){
  return (
    <div className="widget" style={{maxWidth:420}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:'0.75rem',fontWeight:600}}>Workload: {capacity||'--'}</span>
        <span className="small">{Math.round(percentage||0)}%</span>
      </div>
      <div className="workload-bar">
        <div className="workload-fill" style={{width:`${Math.min(percentage||0,100)}%`}} />
      </div>
    </div>
  );
}
