import React from 'react';
import '../Assets/css/App.css';
import Layout from './Layout'

function App({ content }) {
  console.log(content)
  return (
    <Layout
      content={content} />
  );
}

export default App;
