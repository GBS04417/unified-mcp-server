import React from 'react';

const items = [
  { key:'focus', icon:'📊', label:'My Focus' },
  { key:'team', icon:'👥', label:'Team View', roles:['TL','MANAGER'] },
  { key:'portfolio', icon:'📋', label:'Proj Port.', roles:['PM'] },
  { key:'insights', icon:'📈', label:'BU Insights', roles:['BU'] },
  { key:'exec', icon:'🎯', label:'Exec View', roles:['CTO','CEO'] }
];

export default function Sidebar({ active, onSelect, role='USER' }){
  return (
    <div className="sidebar">
      <div style={{fontWeight:600,fontSize:'0.9rem'}}>Navigation</div>
      <div className="separator" />
      {items.filter(i=>!i.roles||i.roles.includes(role)).map(i=>
        <div key={i.key} className={"menu-item "+(active===i.key?'active':'')} onClick={()=>onSelect(i.key)}>
          <span>{i.icon}</span><span>{i.label}</span>
        </div>
      )}
      <div className="menu-group small">Role: {role}</div>
    </div>
  );
}
