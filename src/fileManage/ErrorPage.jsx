import React from 'react';
import { useLocation } from 'react-router-dom';

export function ErrorPage() {
  const location = useLocation();
  const { state } = location;
 

  return (
    <div style={{ textAlign: 'center' }}>
      { state.ErrorMessage.msg }
    </div>
  )
}