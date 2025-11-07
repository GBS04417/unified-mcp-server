export async function fetchDashboard(focusUser){
  const r = await fetch(`/api/priority/dashboard?focusUser=${encodeURIComponent(focusUser||'')}`);
  return r.json();
}
export async function fetchReport(focusUser){
  const r = await fetch(`/api/priority/report?focusUser=${encodeURIComponent(focusUser||'')}`);
  return r.json();
}
export async function fetchWorkload(focusUser){
  const r = await fetch(`/api/priority/workload?focusUser=${encodeURIComponent(focusUser||'')}`);
  return r.json();
}
export async function fetchUrgent(focusUser){
  const r = await fetch(`/api/priority/urgent?focusUser=${encodeURIComponent(focusUser||'')}`);
  return r.json();
}
export async function clearCache(){
  const r = await fetch('/api/priority/cache/clear',{method:'POST'});
  return r.json();
}
