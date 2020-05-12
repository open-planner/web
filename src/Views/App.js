import React from 'react';
import '../Assets/css/App.scss';
import Layout from './Layout'

function App({ content }) {
  return (
    <Layout
      content={content} />
  );
}

export default App;
