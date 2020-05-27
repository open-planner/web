import React, { Component } from 'react'
import banner from '../../Assets/image/3187910.jpg'

export default class index extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <img style={{ width: '100vh' }} className='rounded-half' src={banner} alt="Summer vector created by gstudioimagen - www.freepik.com" />
      </div>
    )
  }
}
