import React from 'react';

const TestForgot = () => {
  console.log('🎯 TestForgot component called');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'orange', 
      color: 'white', 
      fontSize: '24px',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>TEST FORGOT COMPONENT</h1>
      <p>Different file name to test if there's a file issue!</p>
    </div>
  );
};

export default TestForgot;
